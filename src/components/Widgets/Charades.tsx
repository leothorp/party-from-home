import React from 'react';
import { styled, Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';
import { useAppState } from '../../state';

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

function CharadesCard(props: CardProps) {
  return (
    <Card style={{ minWidth: 275 }}>
      <CardContent>{props.cardText}</CardContent>
    </Card>
  );
}

export default function Charades() {
  const { participants, state: gameState, setState: setGameState } = useWidgetContext({
    deck: ['placeholder'],
    canDraw: true,
    drawn: [''],
    cardText: 'Click new game to begin!',
    currentActor: { uid: '', displayName: '' },
    currentTeam: 'Nobody',
    teams: { red: [], blue: [] },
    score: { red: 0, blue: 0 },
  });

  const { user } = useAppState();

  // Starts a new game
  function startGame() {
    const players = participants;

    if (players.length < 2) {
      setGameState({ cardText: 'You need at least two players to start a game!' });
      return;
    }
    const teams = defineTeams(players);
    const currentTeam = 'red';
    const currentActor = pickActor(currentTeam, teams);
    const score = { red: 0, blue: 0 };

    const deck = ['placeholder'];
    const canDraw = true;
    const drawn = [''];
    const cardText = 'Draw a card to begin!';

    setGameState({ deck, canDraw, drawn, cardText, currentActor, currentTeam, score });
  }

  // Moves game to next team
  function nextTeam() {
    const newGS = { ...gameState };

    // Pick card and remove from deck
    const drawNumber = Math.floor(gameState.deck.length * Math.random());
    newGS.drawn = newGS.deck.splice(drawNumber, 1).concat(gameState.drawn);
    newGS.topCardText = newGS.drawn[0];

    // Update team and actor
    newGS.currentTeam = getCurrentTeam(gameState.currentTeam);
    newGS.currentActor = pickActor(newGS.currentTeam, newGS.teams);

    // Handle an empty deck
    if (newGS.deck.length === 0) {
      newGS.currentTeam = 'Nobody';
      newGS.canDraw = false;
    }

    setGameState(newGS);
  }

  function addScore(team: string) {
    const newGS = { ...gameState };
    newGS.score = gameState.score[team] + 1;

    setGameState(newGS);
  }

  const playAreaContent = getPlayAreaContent(gameState, user);

  return (
    <Container>
      {gameState && gameState.beerImg ? (
        <>
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
            <h1>Current Team: {gameState.currentTeam}</h1>
            <Button id="shuffle" onClick={() => startGame()}>
              New Game
            </Button>
            <Button id="nextTurn" onClick={() => nextTeam()}>
              Next Team
            </Button>
          </Footer>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}

function getPlayAreaContent(gameState: any, user: any) {
  const gameInProgress = gameState.currentTeam !== 'Nobody';
  const isCurrentActor = user.uid === gameState.currentActor.uid;

  if (!gameInProgress) return <CharadesCard cardText="Click new game to begin!" />;
  if (!isCurrentActor) return <CharadesCard cardText="The other team is playing. Sit back and relax!" />;

  return <CharadesCard cardText={gameState.cardText} />;
}

function getCurrentTeam(lastTeam: String) {
  if (lastTeam === 'red') {
    return 'blue';
  } else {
    return 'red';
  }
}

function pickActor(currentTeam: String, teams: Object) {
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
