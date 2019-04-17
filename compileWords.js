let unirest = require('unirest');
let seedWords = require('./seedWords');
let shuffle = require('./shuffle');
console.log(seedWords);

console.log('hi stu');
var wordsApiUrl = 'https://wordsapiv1.p.rapidapi.com/words/';

// var wordnikApi = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech=interjection,preposition,abbreviation,affix,article,auxiliary-verb,conjunction,definite-article&maxCorpusCount=-1&minLength=5&maxLength=-1&limit=10&api_key=97d94b0b7779a50ac900e04879302f1c70b3d0fa7b6102f20&includePartOfSpeech=noun,adjective,verb&minimumCorpusCount=5000';

var promises = seedWords
  .map((word) => {
    return unirest
      .get(wordsApiUrl + word)
      .headers('X-Mashape-Key', 'AAoWTRQr5nmshGZgNIdtpy7qcTYFp1WmlhOjsnCxoZU0RUQeln')
  });

const relationshipsToCheck = [
  "synonyms",
  "typeOf",
  "examples ",
  'hasTypes',
  'similarTo',
];

module.exports = Promise.all(promises).then((values) => {
  const arrayofSets = values
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
      setOfArray.forEach((word) => {
        if (word.includes(value.word)) {
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
  const topResults = arrayofSets
    .sort((a, b) => {
      if (a.relatedWords.length < b.relatedWords.length) {
        return -1;
      }
      return 1;
    })
    .slice(0, 6);
  return shuffle(topResults)
    .map((result, index) => ({ ...result, parentWordNumber: index + 1 }));
})


