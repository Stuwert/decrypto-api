let unirest = require('unirest');
let seedWords = require('./seedWords');
let shuffle = require('../Utilities/shuffle');

var wordsApiUrl = 'https://wordsapiv1.p.rapidapi.com/words/';

var wordnikApi = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=pronoun%2Cpreposition%2Caffix%2Cfamily-name%2Cgiven-name%2Cnoun-posessive%2Cpast-participle%2Cproper-noun&minCorpusCount=100000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=12&maxLength=12&limit=12&api_key=97d94b0b7779a50ac900e04879302f1c70b3d0fa7b6102f20';

const reduceRelatedWords = (
  allRelatedWords,
  relatedWordsArray
) => {
  const relationships = ["synonyms", "typeOf", "examples ", "hasTypes", "similarTo"];
  relationships.forEach((relationship) => {
    if (relatedWordsArray[relationship] !== undefined) {
      allRelatedWords = allRelatedWords.concat(relatedWordsArray[relationship]);
    }
  })
  return allRelatedWords
};

const seedWordsToApi = ({ body }) => (
  body
    .map(({ word }) => word)
    .map((word) => {
      return unirest
        .get(wordsApiUrl + word)
        .headers('X-Mashape-Key', 'AAoWTRQr5nmshGZgNIdtpy7qcTYFp1WmlhOjsnCxoZU0RUQeln')
    })
)

const getCompiledWords = () => {


  // Get seedwords from Wordnik
  return unirest
    .get(wordnikApi)
    .headers('Accept', 'application/json')
    .then(
      (results) => {
        // Map Seedwords to get relationships from wordsApi
        const apiCalls = seedWordsToApi(results);
        return Promise.all(apiCalls)
          .then((relatedWordsArray) => {
            // It is theoretically possible to
            // get back bad values, but we're going to
            // be naive for now.
            // .filter((value) => (
            //   value.success !== false &&
            //   value.results !== undefined
            // ))
            const wordApiResponseBody = relatedWordsArray.map(({ body }) => body);

            let parsedWords = wordApiResponseBody.reduce((parsingAccumulator, { word: parentWord, results: relatedWordsArrays }) => {

              // Be careful, this is technically a filtering mechanism
              if (relatedWordsArray === undefined) {
                return parsingAccumulator;
              }

              const combinedRelatedWords = relatedWordsArrays.reduce(reduceRelatedWords, []);
              const relatedWords = new Set(combinedRelatedWords);

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
              .slice(0, 6)
              .map((wordStuff, index) => ({ ...wordStuff, parentWordNumber: index + 1 }));
          })
      });
}

module.exports = getCompiledWords;




