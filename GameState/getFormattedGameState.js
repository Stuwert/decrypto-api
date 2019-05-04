const knex = require('../db/knex');

const formatGameState = ({
  id: id,
  created_at: startedAt,
  correct_guess_count: correctGuessCount,
  ended_at: endedAt,
  incorrect_guess_count: incorrectGuessCount,
  current_round: currentRound,
  key: key,
}) => ({
  id,
  startedAt,
  correctGuessCount,
  endedAt,
  incorrectGuessCount,
  currentRound,
  key,
});


module.exports = async (gameKey) => {
  const [gameState] = await knex('games')
    .where({ key: gameKey });

  return formatGameState(gameState);
}
