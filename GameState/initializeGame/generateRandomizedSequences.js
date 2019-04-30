let shuffle = require('../../Utilities/shuffle');

// At some point I would like this to generate an arbitary number of loops depending on array length
const generateRandomizedSet = (parentWordIds) => {
  let twoAccumulator = [];
  let threeAccumulator = [];
  let fourAccumulator = [];
  // const sequenceLength = 4;

  // const iterators = Array.apply(null, { length: sequenceLength }).map((item, i) => i + 1);

  parentWordIds.forEach(numberOne => {
    parentWordIds.forEach(numberTwo => {
      if (numberOne !== numberTwo) {
        twoAccumulator.push([numberOne, numberTwo]);
        parentWordIds.forEach((numberThree) => {
          // Sequences must not contain repeat numbers.
          // These if checks should prevent that
          if (numberThree !== numberOne && numberThree !== numberTwo) {
            threeAccumulator.push([numberOne, numberTwo, numberThree])
            parentWordIds.forEach((numberFour) => {
              if ([numberOne, numberTwo, numberThree].indexOf(numberFour) === - 1) {
                fourAccumulator.push([numberOne, numberTwo, numberThree, numberFour]);
              }
            })
          }
        })
      }
    })
  });

  twoLengthSequences = shuffle(twoAccumulator);
  threeLengthSequences = shuffle(threeAccumulator);
  fourLengthSequences = shuffle(fourAccumulator);

  return {
    twoLengthSequences,
    threeLengthSequences,
    fourLengthSequences,
  }
}

module.exports = generateRandomizedSet;
