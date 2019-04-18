let shuffle = require('./Utilities/shuffle');



const generateRandomizedSet = () => {
  const accumulator = [];
  const numberOfWords = [1, 2, 3, 4, 5, 6];

  numberOfWords.forEach(numberOne => (
    numberOfWords.forEach(numberTwo => {
      if (numberOne !== numberTwo) {
        numberOfWords.forEach((numberThree) => {
          // Sequences must not contain repeat numbers.
          // These if checks should prevent that
          if (numberThree !== numberOne && numberThree !== numberTwo) {
            accumulator.push([numberOne, numberTwo, numberThree])
          }
        })
      }
    })
  ));

  return shuffle(accumulator);
}


module.exports = generateRandomizedSet;
