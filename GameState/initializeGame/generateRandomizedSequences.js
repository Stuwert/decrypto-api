let shuffle = require('../../Utilities/shuffle');

// At some point I would like this to generate an arbitary number of loops depending on array length
const generateRandomizedSet = () => {
  let twoAccumulator = [];
  let threeAccumulator = [];
  let fourAccumulator = [];
  const numberOfWords = [1, 2, 3, 4, 5];
  // const sequenceLength = 4;

  // const iterators = Array.apply(null, { length: sequenceLength }).map((item, i) => i + 1);

  numberOfWords.forEach(numberOne => {
    numberOfWords.forEach(numberTwo => {
      if (numberOne !== numberTwo) {
        twoAccumulator.push([numberOne, numberTwo]);
        numberOfWords.forEach((numberThree) => {
          // Sequences must not contain repeat numbers.
          // These if checks should prevent that
          if (numberThree !== numberOne && numberThree !== numberTwo) {
            threeAccumulator.push([numberOne, numberTwo, numberThree])
            numberOfWords.forEach((numberFour) => {
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
