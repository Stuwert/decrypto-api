const knex = require('../db/knex');


const getRootQuery = (gameId) => knex
  .from('parent_concepts')
  .join('game_answers', 'parent_concepts.id', 'game_answers.parent_concept_id')
  .where('game_answers.game_id', gameId);

const getParentConcepts = async (gameId) => {
  const parentConcepts = await getRootQuery(gameId)
    .select('parent_concepts.id')

  return parentConcepts.map(({ id }) => id);
}

const formatAnswers = ({
  id,
  name,
}) => ({
  parentConceptId: id,
  parentConcept: name,
});

const getGameAnswers = async (gameId) => {
  const gameAnswers = await getRootQuery(gameId)
    .select(
      'parent_concpets.id',
      'parnet_concepts.name'
    );

  return formatAnswers(gameAnswers);
}

module.exports = {
  getParentConcepts,
  getGameAnswers
};
