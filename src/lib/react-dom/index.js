let wipRoot = null;
let nextUnitOfWork = null;
let currentRoot = null;
let deletions = null;

const isEvent = (key) => key.startsWith('on');

const isProperty = (key) => key !== 'children' && !isEvent(key);

const isGone = (prev, next) => (key) => !(key in next);

const isNew = (prev, next) => (key) => prev[key] !== next[key];

const updateDom = (dom, prevProps, nextProps) => {
  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    // eslint-disable-next-line array-callback-return
    .filter((key) => {
      // eslint-disable-next-line no-unused-expressions
      /* present only in old fiber */ !(key in nextProps) ||
        /* changed event listener */ isNew(prevProps, nextProps)(key);
    })
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove the props that are gone
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    // eslint-disable-next-line no-param-reassign,no-return-assign
    .forEach((name) => (dom[name] = ''));

  // Set the props that are new or changed
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    // eslint-disable-next-line no-param-reassign,no-return-assign
    .forEach((name) => (dom[name] = nextProps[name]));

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
};

const createDom = (fiber) => {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? /* using textNode instead of innerHTML will allow us to treat all elements the same way */
        document.createTextNode('')
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
};

const commitDeletion = (fiber, domParent) => {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    /*
     * Function component - 2. when removing a node we also need to keep going until
     *  we find a child with a DOM node
     * */
    commitDeletion(fiber.child, domParent);
  }
};

/*
 * @param elements we want to reconcile
 * */
const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  const oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  /*
   * We iterate at the same time over the children of the old fiber (wipFiber.alternate)
   * and the array of elements we want to reconcile.
   * */
  while (index < elements.length || oldFiber != null) {
    // element - thing we want to render to the DOM
    const element = elements[index];

    let newFiber = null;

    /*
     * Compare old fiber to see if there’s any change we need to apply to the DOM
     * */
    const sameType = oldFiber && element && element.type === oldFiber.type;

    /*
     * if the old fiber and the new element have the same type,
     * we can keep the DOM node and just update it with the new props
     * */
    if (sameType) {
      /*
       * Update the node
       * we create a new fiber keeping the DOM node from the old fiber and the props from the element.
       * */
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }

    /*
     * if the type is different and there is a new element, it means we need to create a new DOM node
     * */
    if (element && !sameType) {
      // add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    /*
     * and if the types are different and there is an old fiber, we need to remove the old node
     * */
    if (oldFiber && !sameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    /*
     * And we add it to the fiber tree setting it either as a child or as a sibling,
     * depending on whether it’s the first child or not.
     * */

    if (index === 0) {
      // eslint-disable-next-line no-param-reassign
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index += 1;
  }
};

const updateFunctionComponent = (fiber) => {
  // children come from running the function instead of getting them directly from the props
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
};

const updateHostComponent = (fiber) => {
  /*
   * 1. add the element to the DOM
   * 2. create the fibers for the element’s children
   * 3. select the next unit of work
   * */

  // 1. create new node and append it to the dom
  if (!fiber.dom) {
    // eslint-disable-next-line no-param-reassign
    fiber.dom = createDom(fiber);
  }

  /*  if (fiber.parent) {
    /!*
     * Problem: We are adding a new node to the DOM each time we work on an element.
     * The browser could interrupt our work before we finish rendering the whole tree.
     * In that case, the user will see an incomplete UI. And we don’t want that.
     * *!/
    fiber.parent.dom.appendChild(fiber.dom);
    /!*
     * Solution: remove the part that mutates the DOM from here
     * Instead keep track of the root of the fiber tree - wipRoot
     * *!/
  } */

  // 2. create new fiber for each child
  const elements = fiber.props.children;

  reconcileChildren(fiber, elements);
};

/*
 * @param fiber - unit of work. one fiber for each react element
 * */
const performUnitOfWork = (fiber) => {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  /*
   * Finally we search for the next unit of work. We first try with the child, then with the sibling,
   * then with the uncle, and so on.
   * */
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
};

const commitWork = (fiber) => {
  if (!fiber) {
    return;
  }
  /*
   * The fiber from a function component doesn’t have a DOM node
   * */

  let domParentFiber = fiber.parent;
  /*
   * Function component:  1. to find the parent of a DOM node we’ll need to go up the fiber tree until
   * we find a fiber with a DOM node
   * */
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  // const domParent = fiber.parent.dom;
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }

  // recursively append all the nodes to the dom
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const commitRoot = () => {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // save a reference to last fiber tree committed to the DOM
  currentRoot = wipRoot;
  wipRoot = null;
};

/*
 * @param deadline
 * how much time we have until the browser needs to take control again
 * */
const workLoop = (deadline) => {
  // initial: set pause execution to false
  let shouldYield = false;
  // loop and set first unit of work
  while (nextUnitOfWork && !shouldYield) {
    // perform current work and return next unit of work
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // pause execution if time remaining < 1ms
    shouldYield = deadline.timeRemaining() < 1;
  }
  /*
   * And once we finish all the work, we commit the whole fiber tree to the DOM.
   * */
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  // schedule work when browser is idle
  window.requestIdleCallback(workLoop);
};

/*
 * when the browser is ready, it will call our workLoop and we’ll start working on the root
 * */
window.requestIdleCallback(workLoop);

export const render = (element, container) => {
  wipRoot = {
    // type: string | function
    dom: container, // keep track of DOM node
    props: {
      children: [element],
    },
    /*
     * -- links to other fibers --
     */
    alternate: currentRoot, // link to the old fiber - the fiber that we committed to the DOM in the previous commit phase
    /*
     * child - link to first child
     * parent - link to parent
     * sibling - link to next sibling
     * */
  };

  deletions = [];

  /*
   * set nextUnitOfWork to the root of the fiber tree
   * fiber tree: data structure to organize the unit of work
   * */
  nextUnitOfWork = wipRoot;
};

export const oldRender = (component, container) => {
  // create and add elements to DOM
  let element = component;
  if (typeof element.type === 'function') {
    element = element.type(element.props);
  }

  const dom =
    element.type === 'TEXT_ELEMENT'
      ? /* using textNode instead of innerHTML will allow us to treat all elements the same way */
        document.createTextNode('')
      : document.createElement(element.type);

  // eslint-disable-next-line no-shadow
  const isProperty = (key) => key !== 'children';

  Object.keys(element.props)
    .filter(isProperty) // filter children prop
    .forEach((name) => {
      /**
       * Add props like nodeValue
       */
      dom[name] = element.props[name];
    });

  if (element.props.children) {
    element.props.children.forEach(
      (child) =>
        /*
         * Problem: recursive call won’t stop until we have rendered the complete element tree.
         * If the element tree is big, it may block the main thread for too long.
         *  And if the browser needs to do high priority stuff like handling user input or
         *  keeping an animation smooth, it will have to wait until the render finishes.
         * */
        render(child, dom)
      /*
       * Solution: schedule work when there is free time at the end of a frame.
       * Break the work into small units, and after we finish each unit we’ll let the browser
       * interrupt the rendering if there’s anything else that needs to be done
       * */
    );
  }

  container.appendChild(dom);
};

const ReactDOM = {
  render,
  performUnitOfWork,
  commitWork,
};

export default ReactDOM;
