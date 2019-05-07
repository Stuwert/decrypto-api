const knex = require('../db/knex');

const showParentConceptId = (parentId, showAnswer, overrideShowAnswer) => {
  if (showAnswer || overrideShowAnswer) return parentId;
  return undefined;
}

const formatClue = (overrideShowAnswer) => ({
  sequence_location: sequenceLocation,
  game_round: gameRound,
  user_guessed_parent_concept_id: userGuessedParentConceptId,
  show_answer: showAnswer,
  name: childConcept,
  parent_concept_id: parentConceptId,
  id,
}) => ({
  childConcept,
  sequenceLocation,
  gameRound,
  userGuessedParentConceptId,
  parentConceptId: showParentConceptId(parentConceptId, showAnswer, overrideShowAnswer),
  isCorrect: userGuessedParentConceptId === parentConceptId,
  id,
  showAnswer: overrideShowAnswer ? showAnswer : undefined
});

const getRoundCluesFromRound = async (currentRound, gameId, overrideShowAnswer) => {
  const clues = await knex('child_concepts')
    .join('game_clues', 'child_concepts.id', 'game_clues.child_concept_id')
    .andWhere('game_clues.game_id', gameId)
    .andWhere('game_clues.game_round', currentRound)
    .orderBy('game_clues.sequence_location');

  const formatClueWithOverride = formatClue(overrideShowAnswer);

  return clues.map(formatClueWithOverride);
}

const getRoundCluesNotFromRound = async (currentRound, gameId, overrideShowAnswer = false) => {
  const clues = await knex('game_clues')
    .join('child_concepts', 'game_clues.child_concept_id', 'child_concepts.id')
    .andWhere('game_clues.game_id', gameId)
    .andWhereNot('game_clues.game_round', currentRound);

  const formatClueWithOverride = formatClue(overrideShowAnswer);
  console.log(clues);
  console.log(clues.map(formatClueWithOverride));

  return clues.map(formatClueWithOverride);
}

module.exports = {
  getRoundCluesFromRound,
  getRoundCluesNotFromRound,
  formatClue,
};
