
const compareGuessToAnswer = (
  currentRoundWords,
  { word: guessWord, guess }
) => {
  const foundWord = currentRoundWords.find(({ word }) => word === guessWord);

  if (foundWord === undefined) {
    throw new Error('You are not guessing a valid sequence');
  }

  const { answer } = foundWord;
  return answer === guess;
};

const incrementedCounts = (checkedAnswers) => {
  const includesIncorrect = checkedAnswers.find(({ isCorrect }) => isCorrect === false)

  if (includesIncorrect) {
    return [0, 1];
  }
  return [1, 0];
}
