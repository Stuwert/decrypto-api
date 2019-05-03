const knex = require('../db/knex');

const formatGameState = ({
  id: id,
  created_at: startedAt,
  correct_guess_count: correctGuessCount,
  ended_at: endedAt,
  incorrect_guess_count: incorrectGuessCount,
  current_round: currentRound,
}) => ({
  id,
  startedAt,
  correctGuessCount,
  endedAt,
  incorrectGuessCount,
  currentRound,
});


module.exports = async (gameId) => {
  const [gameState] = await knex('games')
    .where({ id: gameId });

  return formatGameState(gameState);
}
