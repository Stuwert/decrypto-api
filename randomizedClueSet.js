let shuffle = require('./shuffle');

const numberOfWords = [1, 2, 3, 4, 5, 6];

const accumulator = [];

numberOfWords.forEach(numberOne => (
  numberOfWords.forEach(numberTwo => (
    numberOfWords.forEach(numberThree => accumulator.push([numberOne, numberTwo, numberThree]))
  ))
))

module.exports = shuffle(accumulator);
