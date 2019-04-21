let unirest = require('unirest');
let seedWords = require('./seedWords');
let shuffle = require('../Utilities/shuffle');

var wordsApiUrl = 'https://wordsapiv1.p.rapidapi.com/words/';

var wordnikApi = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=pronoun%2Cpreposition%2Caffix%2Cfamily-name%2Cgiven-name%2Cnoun-posessive%2Cpast-participle%2Cproper-noun&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=6&maxLength=6&limit=6&api_key=97d94b0b7779a50ac900e04879302f1c70b3d0fa7b6102f20';

const getCompiledWords = () => {
  const relationshipsToCheck = [
    "synonyms",
    "typeOf",
    "examples ",
    'hasTypes',
    'similarTo',
  ];

  return unirest
    .get(wordnikApi)
    .headers('Accept', 'application/json')
    .then((results) => {
      const promises = results.body
        .map(({ word }) => word)
        .map((word) => {
          return unirest
            .get(wordsApiUrl + word)
            .headers('X-Mashape-Key', 'AAoWTRQr5nmshGZgNIdtpy7qcTYFp1WmlhOjsnCxoZU0RUQeln')
        })

      return Promise.all(promises).then((values) => {
        return values
          .map((value) => value.body)
          .filter((value) => (
            value.success !== false &&
            value.results !== undefined
          ))
          .reduce((arrayOfSets, value) => {
            const accumulatedArray = value.results.reduce((arr, result) => {
              return [
                ...arr,
                ...relationshipsToCheck.reduce((combinedArray, relationship) => {
                  if (result[relationship] !== undefined) {
                    return [
                      ...combinedArray,
                      ...result[relationship]
                    ]
                  }
                  return combinedArray
                }, [])
              ];
            }, []);
            const setOfArray = new Set(accumulatedArray);
            setOfArray
              .forEach((word) => {
                if (word.includes(value.word) ||
                  word === '' ||
                  word === undefined ||
                  word === null
                ) {
                  setOfArray.delete(word);
                }
              })
            return [
              ...arrayOfSets,
              {
                parentWord: value.word,
                relatedWords: setOfArray
              }
            ]
          }, [])
          .map((result, index) => ({ ...result, parentWordNumber: index + 1 }));
      })
    });
}

module.exports = getCompiledWords;




