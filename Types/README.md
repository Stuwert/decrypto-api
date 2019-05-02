# Cipher API
---

This is the Graph API backend for a small game port called Cipher which is based on the board game [Decrypto](https://boardgamegeek.com/boardgame/225694/decrypto), though this is admittedly a very limited implementation of the game.

## Setup

```

cd dir
npm install
node ./index.js

```


### Architecture

```
\GameState // manages any logic that mutates the state of the game
// this includes generating new rounds, validating user guesses, and initializing the game
\migrations
\Mutation
\Query
\Types
```

### Graph Types

Currently in the process of transitioning this, but ultimately the end state will look something like the following...

```
type Game {
  correctGuessCount: Int!
  createdAt: DateTime
  endedAt: DateTime
  id: ID!
  incorrectGuessCount: Int!
  updatedAt: DateTime
  gameClues: [GameClue]
}

type GameAnswer {

}

type GameClue {
  childConcept: String!
  sequenceLocation: Int!
  gameRound: Int!
  game: Game
  userGuessedParentConceptId: ID!
  parentConceptId: ID!
}

type Sequence {
  fourLengthSequences: [Int] #length 4
  threeLengthSequences: [Int] # length 3
  twoLengthSequences: [Int] # length 2
}



```


### Basic Game Actions

This game is fairly straightforward and single player for the time, so there are only a few different actions that




