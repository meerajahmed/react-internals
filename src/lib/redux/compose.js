const reducer = (accumulator, fn) => fn(accumulator);

const compose = (...fns) => (input) => fns.reduceRight(reducer, input);

export default compose;
