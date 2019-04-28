const knex = require('../db/knex');
const moment = require('moment');


generateRoundClues() {
  this.checkGameReady();

  const roundSequence = this.getClueSequenceFromRound();

  const generateRoundClue = this.generateRoundClue.bind(this);
  this.currentRoundWords = roundSequence.map(generateRoundClue);



  return this.currentRoundWords;
}

generateRoundClue(parentWordNumber) {
  const word = this.popWordFromSeedWords(parentWordNumber);

  return {
    word,
    answer: parentWordNumber,
    isCorrect: null,
  }
}

const getNextClue = (parentAnswerId => {

})

const generateNewRound = (gameState) => {

  generateRoundSequence(gameState).then((clueSequence) => {
    return knex('game_rounds').insert({
      created_at: moment(),
      updated_at: moment(),
      game_id: gameState.id
      round_id: gameState.rounds + 1 // This is not a thing... lol
      clueSequence: clueSequence,
    })
      .returning('clue_sequecne')
  }).then((clueSequence) => Promise.all(clueSequence[0].map()})
  .then((cluePromises) => Promise.all)
}

const getRoundSequence = (gameState) => {
  const keys = [
    "threeAccumulator",
    "twoAccumulator",
    "fourAccumulator",
  ];

  const {
    remaining_sequences: remainingSequences,
    correct_guess_count: correctGuessCount,
    id: gameId
  } = gameState;

  const sequence = remainingSequences[keys[correctGuessCount]].pop();
  return knex('games').where({ id: gameId })
    .update({ remaining_sequences: remainingSequences })
    .then(() => sequence)

}

const generateRoundClues = (gameId) => {

}
