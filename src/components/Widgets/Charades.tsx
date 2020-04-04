import React, { useState, useEffect, useCallback } from 'react';
import { styled, Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';
import { useAppState } from '../../state';

const wordList = require('./charades.json');

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'darkgreen',
  height: '100%',
});

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '25%',
  '& img': {
    alignSelf: 'center',
    maxHeight: '100%',
  },
  '& input': {
    maxHeight: '100%',
  },
});

const PlayArea = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50%',
  '& *': {
    marginLeft: '10px',
  },
  '& img': {
    alignSelf: 'center',
    maxHeight: '100%',
  },
  '& input': {
    maxHeight: '100%',
  },
});

const Footer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  height: '25%',
  '& *': {
    marginLeft: '10px',
  },
  '& img': {
    alignSelf: 'center',
    maxHeight: '100%',
  },
  '& input': {
    maxHeight: '100%',
  },
});

const Instruction = styled('h1')({
  textAlign: 'center',
});

type CardProps = {
  cardText: String;
};

type Teams = {
  red: Array<any>;
  blue: Array<any>;
};

function CharadesCard(props: CardProps) {
  return (
    <Card style={{ minWidth: 275 }}>
      <CardContent>{props.cardText}</CardContent>
    </Card>
  );
}

export default function Charades() {
  const { participants, state: gameState, setState: setGameState, ready } = useWidgetContext({
    teams: { red: [], blue: [] },
    currentTeam: 'Nobody',
    currentActor: { identity: '', displayName: '' },
    score: { red: 0, blue: 0 },
    //TODO(roman): let players choose category;
    deck: wordList.charades.medium,
    canDraw: true,
    drawn: [''],
    cardText: 'Click new game to begin!',
  });

  console.log(gameState);

  const { user } = useAppState();
  const [userTeam, setUserTeam] = useState<any | null>(null);
  console.log(`team: ${userTeam}`);

  useEffect(() => {
    if (ready && user && (!userTeam || userTeam === 'none')) {
      setUserTeam(getUserTeam(user, gameState.teams));
    }
  }, [gameState.teams, ready, user, userTeam]);

  // Starts a new game
  const startGame = useCallback(() => {
    const players = participants;

    // TODO(roman): fix this (low priority)
    if (players.length < 2) {
      setGameState({ ...gameState, cardText: 'You need at least two players to start a game!' });
      return;
    }
    const teams = defineTeams(players);
    const currentTeam = 'red';
    const currentActor = pickActor(currentTeam, teams);
    const score = { red: 0, blue: 0 };

    const deck = wordList.charades.medium;
    const canDraw = true;
    // Pick card and remove from deck
    const drawNumber = Math.floor(gameState.deck.length * Math.random());
    const drawn = gameState.deck.splice(drawNumber, 1).concat(gameState.drawn);
    const cardText = drawn[0];

    setGameState({ ...gameState, teams, currentTeam, currentActor, score, deck, canDraw, drawn, cardText });

    setUserTeam(getUserTeam(user, teams));
  }, [gameState, participants, setGameState, user]);

  // Moves game to next team
  const nextTurn = useCallback(() => {
    const newGS = { ...gameState };

    // Pick card and remove from deck
    const drawNumber = Math.floor(gameState.deck.length * Math.random());
    newGS.drawn = newGS.deck.splice(drawNumber, 1).concat(gameState.drawn);
    newGS.cardText = newGS.drawn[0];

    // Update team and actor
    newGS.currentTeam = getNextTeam(gameState.currentTeam);
    newGS.currentActor = pickActor(newGS.currentTeam, newGS.teams);

    // Handle an empty deck
    if (newGS.deck.length === 0) {
      newGS.currentTeam = 'Nobody';
      newGS.canDraw = false;
    }

    setGameState(newGS);
  }, [gameState, setGameState]);

  const addScore = useCallback(
    (team: string) => {
      const newGS = { ...gameState };
      newGS.score[team] = gameState.score[team] + 1;

      setGameState(newGS);
    },
    [gameState, setGameState]
  );

  if (ready && user) {
    const playAreaContent = getPlayAreaContent(gameState, user, userTeam);

    return (
      <Container>
        <Header>
          <Instruction>{gameState.currentActor.displayName}'s turn!</Instruction>
        </Header>
        <PlayArea>{playAreaContent}</PlayArea>
        <Footer id="score">
          <Button id="redScore" onClick={() => addScore('red')}>
            +
          </Button>
          <h1>Red: {gameState.score.red}</h1>
          <h1>Blue: {gameState.score.blue}</h1>
          <Button id="blueScore" onClick={() => addScore('blue')}>
            +
          </Button>
        </Footer>
        <Footer>
          <Button id="shuffle" onClick={() => startGame()}>
            New Game
          </Button>
          <h1>Your team: {userTeam}</h1>
          <Button id="nextTurn" onClick={() => nextTurn()}>
            Next Turn
          </Button>
        </Footer>
      </Container>
    );
  } else {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }
}

function getPlayAreaContent(gameState: any, user: any, userTeam: string) {
  const gameInProgress = gameState.currentTeam !== 'Nobody';
  const isCurrentActor = user.identity === gameState.currentActor.identity;

  if (!gameInProgress) return <CharadesCard cardText="Click new game to begin!" />;
  if (userTeam === 'none') return <CharadesCard cardText="Game in progress, wait for a new game to join!" />;

  if (gameState.currentTeam !== userTeam) {
    return <CharadesCard cardText="The other team is playing. Sit back and relax!" />;
  } else {
    if (!isCurrentActor) return <CharadesCard cardText="Someone else on your team is acting." />;
    return <CharadesCard cardText={gameState.cardText} />;
  }
}

function getUserTeam(user: any, teams: Teams) {
  for (const player of teams.red) {
    if (user.identity === player.identity) return 'red';
  }

  for (const player of teams.blue) {
    if (user.identity === player.identity) return 'blue';
  }

  return 'none';
}

function getNextTeam(lastTeam: String) {
  if (lastTeam === 'red') {
    return 'blue';
  } else {
    return 'red';
  }
}

function pickActor(currentTeam: String, teams: Teams) {
  // @ts-ignore
  const pickablePlayers = teams[currentTeam];

  return pickablePlayers[Math.floor(pickablePlayers.length * Math.random())];
}

function defineTeams(players: Array<Object>) {
  shuffle(players);

  const slicePoint = Math.ceil(players.length / 2);

  // Red will have more people if odd number.
  return {
    red: players.slice(0, slicePoint),
    blue: players.slice(slicePoint, players.length),
  };
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a: Array<any>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
