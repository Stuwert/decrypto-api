let unirest = require('unirest');
let seedWords = require('./seedWords');
let shuffle = require('../Utilities/shuffle');
require('dotenv').config();
const { WORDNIK_API_KEY: wordnikApiKey, WORDS_API_KEY: wordsApiKey } = process.env;


var wordsApiUrl = 'https://wordsapiv1.p.rapidapi.com/words/';

// var wordnikApi = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=pronoun%2Cpreposition%2Caffix%2Cfamily-name%2Cgiven-name%2Cnoun-posessive%2Cpast-participle%2Cproper-noun&minCorpusCount=75000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=12&maxLength=12&limit=12&api_key=' + wordnikApiKey;



const reduceRelatedWords = (
  allRelatedWords,
  relatedWordsArray
) => {
  const relationships = ["synonyms", "typeOf", "examples", "hasTypes", "similarTo"];
  relationships.forEach((relationship) => {
    if (relatedWordsArray[relationship] !== undefined) {
      const relatedWords = relatedWordsArray[relationship].map((word) => ({ word, relationship }));
      allRelatedWords = allRelatedWords.concat(relatedWords);
    }
  })
  return allRelatedWords
};

const seedWordsToApi = () => {
  // console.log("Body is ", body);
  // old input { body }
  // return body
  // .map(({ word }) => word)
  console.log(seedWords());
  return seedWords()
    .map((word) => {
      return unirest
        .get(wordsApiUrl + word)
        .headers('X-Mashape-Key', wordsApiKey)
    })
}

const getCompiledWords = (numberOfCompiledwords) => {

  // Fault tolerance will occur in 3 locations
  // 1. If the word has already been searched, go get the relationships from the databse
  // 2. If there aren't enough responses from the gotten words, go get a new parent word that hasn't already existed
  // 3. If 5 words have still not been found, retry.

  // Get seedwords from Wordnik

  // return unirest
  //   .get(wordnikApi)
  //   .headers('Accept', 'application/json')
  //   .then(
  //     (results) => {
  //       // Map Seedwords to get relationships from wordsApi
  // const apiCalls = seedWordsToApi(results);
  return Promise.all(seedWordsToApi())
    .then((results) => {
      // It is theoretically possible to
      // get back bad values, but we're going to
      // be naive for now.
      // .filter((value) => (
      //   value.success !== false &&
      //   value.results !== undefined
      // ))
      const wordApiResponseBody = results.map(({ body }) => body);

      let parsedWords = wordApiResponseBody.reduce((parsingAccumulator, { word: parentWord, results: relatedWordsArrays }) => {

        // Be careful, this is technically a filtering mechanism
        if (relatedWordsArrays === undefined) {
          return parsingAccumulator;
        }

        const combinedRelatedWords = relatedWordsArrays.reduce(reduceRelatedWords, []);
        // This will filter out any phrases that have the parent in the phrase
        const filteredRelatedWords = combinedRelatedWords.filter((relatedWord) => !relatedWord.word.includes(parentWord));

        const relatedWords = new Set(filteredRelatedWords);

        parsingAccumulator.push({
          parentWord,
          relatedWords,
        })

        return parsingAccumulator;
      }, []);

      parsedWords.sort((a, b) => {
        const aLength = a.relatedWords.size;
        const bLength = b.relatedWords.size;

        return bLength - aLength;
      });

      // Returns the 6 most valuable words wtih the parent word number attached
      return parsedWords
        .slice(0, numberOfCompiledwords)
        .map((wordStuff, index) => ({ ...wordStuff, parentWordNumber: index + 1 }));
    });
}

module.exports = getCompiledWords;




