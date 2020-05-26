import fp from 'lodash/fp';
import compose from 'lodash/flow';
import isEmpty from 'lodash/isEmpty';

const transformationSequence = [
    { type: 'condition', apply: { using: 'includes', params: [' '] } },
    { type: 'expression', apply: { using: 'split', params: [' '] } },
    { type: 'expression', apply: { using: 'last' } }
]

function getTransformer(sequence) {
  const functionsToBeComposed = sequence.map((transformation) => {

      const { type, apply } = transformation;
      const { using, params } = apply;
      const functionToApply = fp[using];
      if (!functionToApply) return false;
      try {
          const partialFunction = !isEmpty(params) ? functionToApply(...params) : functionToApply;
          if (typeof partialFunction !== 'function') return false;

          if (type === 'condition') {
            return (currentValue) => {
              const result = partialFunction(currentValue);
              if (result) return currentValue;
              return false;
            }
          }
          return partialFunction;
      } catch (err) {
          console.error(err);
          return false;
      }
  });
  return compose(...functionsToBeComposed);
}

const trans = getTransformer(transformationSequence);

console.log(trans('httt http'))
console.log(fp.padStart('sss', 'dddd'))
