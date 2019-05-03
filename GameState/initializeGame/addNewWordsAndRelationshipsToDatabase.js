let knex = require('../../db/knex');
let getCompiledWords = require('../../Words/compileWords');
let moment = require('moment');
const requestedNumberOfWords = 5;

const relationshipToId = {
  "synonyms": 1,
  "typeOf": 2,
  "examples": 3,
  "hasTypes": 4,
  "similarTo": 5,
}

// getting Parents Words With Relationship FromApi
// For now this is going to grab them all at once, eventually, for efficiency we'll pull out the secondary grab
// CheckingWordsAgainstTheDatabase
// Filter out words that exist
// Insert words that don't exist
// repeat for sub words

const findExistingParentWords = (parentWords) => (
  knex('parent_concepts')
    .whereIn('name', parentWords)
    .select('id', 'name')
);

const addFoundIdFromPreexisting = (preExistingWords) => (word) => {
  const foundWord = preExistingWords.find(({ name }) => name === word.parentWord);
  if (foundWord) return { ...word, wordId: foundWord.id }

  return word;
}

const separateWordsToInsertFromWordsToKeep = (wordsArray) => {
  const parentWords = wordsArray.map(({ parentWord }) => parentWord);
  return findExistingParentWords(parentWords).then(
    (preExistingWords) => {

      const addFoundId = addFoundIdFromPreexisting(preExistingWords);

      const mappedResultsToWords = wordsArray.map(addFoundId);

      console.log("Found " + preExistingWords.length + " pre-existing words");

      const wordsToInsert = mappedResultsToWords.filter(
        ({ wordId }) => !wordId
      );
      const wordsToKeep = mappedResultsToWords.filter(
        ({ wordId }) => wordId
      );
      return {
        wordsToInsert,
        wordsToKeep
      }
    }
  )
}

const insertWordsIntoDatabase = (words) => {
  console.log(" Inserting " + words.map(({ parentWord }) => parentWord).join(', ') + " into the db");
  return words.map((word) => {
    return knex('parent_concepts')
      .insert({
        name: word.parentWord,
        created_at: moment(),
        updated_at: moment(),
      })
      .returning('id', 'name')
      .then((wordId) => ({
        ...word,
        wordId: wordId[0],
      }))
      .catch((error) => {
        console.log(`Parent word ${word.parentWord} is erroring`)
        console.log(error);
        return word;
      }) // Knex returns these in an array, so this strips it so we have something easier to work with
  })
}

const setParentFindOrCreateChild = (parentId) => (childWord) => {
  return new Promise((resolve) => {
    console.log(`Looking for child concept with name ${childWord.word}`)
    return knex('child_concepts')
      .where({ name: childWord.word })
      .pluck('id')
      .limit(1)
      .then((childId) => {
        if (childId.length === 0) {
          console.log(`Failed to find child concept, creating child concept`);
          return knex('child_concepts')
            .insert({
              name: childWord.word,
              created_at: moment(),
              updated_at: moment(),
            })
            .returning('id')
            .then((childConcept) => {
              console.log(`Child concept created with id ${childConcept[0]}`)
              return resolve({
                ...childWord,
                childId: childConcept[0],
                parentId,
              });
            })
            .catch((error) => {
              console.log("Child likely already created elsewhere, returning Id")
              return knex('child_concepts')
                .where({ name: childWord.word })
                .pluck('id')
                .limit(1)
                .then((childId) => {
                  return resolve({
                    ...childWord,
                    childId: childId[0],
                    parentId,
                  });
                })
            })
          return;
        }
        console.log(`Found child concept with id ${childId[0]}, returning`);
        return resolve({
          ...childWord,
          childId: childId[0],
          parentId,
        });
      })

  })
}

const setRelationship = ({ childId, parentId, relationship }) => {
  return new Promise((resolve) => {
    console.log(`Looking for a relationship between for ${childId} -> ${parentId} with relationship ${relationship}`)
    const relationshipId = relationshipToId[relationship];
    return knex('parent_child_concept_relationships')
      .where({
        parent_concept_id: parentId,
        child_concept_id: childId,
        concept_relationship_type_id: relationshipId
      })
      .then((relationships) => {
        if (relationships.length === 0) {
          console.log(`Failed to find child concept, creating child concept`);
          return knex('parent_child_concept_relationships')
            .insert({
              parent_concept_id: parentId,
              child_concept_id: childId,
              concept_relationship_type_id: relationshipId,
              created_at: moment(),
              updated_at: moment(),
            })
            .then(() => {
              console.log(`Relationship created`);
              return resolve();
            })
            .catch((error) => {
              console.log("Relationship likely already created");
              return resolve();
            })
          return resolve();
        }
        console.log(`Relationship already exists`);
        return resolve();
      })
  })
}



const insertChildAndParentRelationshipMappings = (parentWords) => {
  console.log("Insert child word relationship");
  console.log(parentWords.length);
  const childWordsWithIdInserts = parentWords.reduce((groupedArray, { relatedWords, wordId }) => {
    const findOrCreateChild = setParentFindOrCreateChild(wordId);
    return groupedArray.concat(Array.from(relatedWords).map(findOrCreateChild));
  }, []);


  return Promise.all(childWordsWithIdInserts)
    .then((childWordWithRelationships) => {
      return Promise.all(childWordWithRelationships.map(setRelationship))
    })
    .then(() => {
      console.log("Does this even see the light of day?")
      return parentWords;
    });
}

const saveWordsToDb = async (knex) => {
  const wordsArray = await getCompiledWords(requestedNumberOfWords);
  const { wordsToInsert, wordsToKeep } = await separateWordsToInsertFromWordsToKeep(wordsArray);

  const resultsOfWordsToInsert = await Promise.all(insertWordsIntoDatabase(wordsToInsert));
  const joinedParentWords = wordsToKeep.concat(resultsOfWordsToInsert || []);
  const parentWords = await insertChildAndParentRelationshipMappings(joinedParentWords);

  return parentWords.map(({ wordId }) => wordId);
}

module.exports = saveWordsToDb;
