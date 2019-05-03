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
\GameState // generates new rounds, validates user guesses, and initializes the game
\migrations
\Mutation
\Query
\Types
\Utilities // generic functions that help do stuff
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
  gameAnswers: [GameAnswer]
}

type GameAnswer {
  parentConcept: String!
  parentConceptId: ID!
}

type GameClue {
  childConcept: String!
  sequenceLocation: Int!
  gameRound: Int!
  userGuessedParentConceptId: ID!
  parentConceptId: ID!
}

```

#### Under The Hood

The are a few under relationships under the hood that aren't accessible via graph types that make this whole thing go:

ParentConcept: Root words that are used as the clues in the games.
ChildConcept: Clues that are given.
ParentChildConceptRelationship: Defines how the child concepts are related to the parents.

While from a pure perspective, this is a duplication of data (it's possible that the same word "incorrectly" shows up twice in parent and child concept tables). Given that the game cares about the data, only unidirectionally, it's easier to handle them as though they are separate entities.

GameAnswer.availableChildConcepts: This stores all of the child


### Basic Game Actions

This game is fairly straightforward and single player for the time, so there are only a few different actions that

*Start Game*
*Check Answers*

Both start game and end game will check and generate a new round (or end the game) if necessary.

... and that's it.


The rest of this is either grabbing the final game state, or grabbing the final game state, with the answers.

*Get Game State*
*Get Final Game State*





