import React, { useEffect } from 'react';
import { styled, Button } from '@material-ui/core';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';

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

export default function KingsCup() {
  const { participants, state: gameState, setState: setGameState, ready } = useWidgetContext({
    deck: [
      '2C',
      '2D',
      '2S',
      '2H',
      '3C',
      '3C',
      '3S',
      '3H',
      '4C',
      '4D',
      '4S',
      '4H',
      '5C',
      '5D',
      '5S',
      '5H',
      '6C',
      '6D',
      '6S',
      '6H',
      '7C',
      '7D',
      '7S',
      '7H',
      '8C',
      '8D',
      '8S',
      '8H',
      '9C',
      '9D',
      '9S',
      '9H',
      '10C',
      '10D',
      '10S',
      '10H',
      'JC',
      'JD',
      'JS',
      'JH',
      'QC',
      'QD',
      'QS',
      'QH',
      'KC',
      'KD',
      'KS',
      'KH',
      'AC',
      'AD',
      'AS',
      'AH',
    ],
    deckImg: '/images/cards/deck.png',
    canDraw: true,
    drawn: [''],
    topCardImg: '/images/cards/empty.png',
    turn: 0,
    lastPlayer: 'Nobody',
    nextPlayer: null,
    popped: false,
    beerImg: '/images/can.png',
  });

  useEffect(() => {
    if (participants && participants.length > 0 && gameState && gameState.nextPlayer === null) {
      setGameState({
        ...gameState,
        nextPlayer: participants[0].displayName,
      });
    }
  }, [gameState, participants, setGameState]);

  // Draws a card and sets the game state
  function DrawCard(gs: any) {
    // Grab data from game state
    var newGS = { ...gs };

    // Pick card and remove from deck
    var drawNumber = Math.floor(gs.deck.length * Math.random());
    newGS.drawn = newGS.deck.splice(drawNumber, 1).concat(gs.drawn);
    newGS.topCardImg = '/images/cards/' + newGS.drawn[0] + '.png';

    // Handle an empty deck
    if (newGS.deck.length === 0) {
      newGS.deckImg = '/images/cards/empty.png';
      newGS.canDraw = false;
    }

    // Increments the turn
    newGS.lastPlayer = participants[gs.turn].displayName;
    newGS.turn++;
    if (newGS.turn >= participants.length) newGS.turn = 0;
    newGS.nextPlayer = participants[newGS.turn].displayName;

    // Check if popped
    var canStress = Math.random();
    if (canStress < Math.pow(1.12, newGS.drawn.length - 52)) {
      newGS.popped = true;
      newGS.beerImg = '/images/canExploded.png';
      newGS.deckImg = '/images/cards/deckGameOver.png';
      newGS.canDraw = false;
    }

    setGameState(newGS);
  }

  // Resets the deck
  function ShuffleDeck(gs: any) {
    var deck = [
      '2C',
      '2D',
      '2S',
      '2H',
      '3C',
      '3C',
      '3S',
      '3H',
      '4C',
      '4D',
      '4S',
      '4H',
      '5C',
      '5D',
      '5S',
      '5H',
      '6C',
      '6D',
      '6S',
      '6H',
      '7C',
      '7D',
      '7S',
      '7H',
      '8C',
      '8D',
      '8S',
      '8H',
      '9C',
      '9D',
      '9S',
      '9H',
      '10C',
      '10D',
      '10S',
      '10H',
      'JC',
      'JD',
      'JS',
      'JH',
      'QC',
      'QD',
      'QS',
      'QH',
      'KC',
      'KD',
      'KS',
      'KH',
      'AC',
      'AD',
      'AS',
      'AH',
    ];
    var deckImg = '/images/cards/deck.png';
    var canDraw = true;
    var drawn = [''];
    var topCardImg = '/images/cards/empty.png';
    var players = participants;
    if (players.length < 1) players = [{ identity: '', displayName: '' }];
    var turn = gs.turn;
    if (turn >= players.length) turn = 0;
    var lastPlayer = gs.lastPlayer;
    var nextPlayer = players[turn].displayName;
    var popped = false;
    var beerImg = '/images/can.png';

    setGameState({ deck, deckImg, canDraw, drawn, topCardImg, turn, lastPlayer, nextPlayer, popped, beerImg });
  }

  return (
    <Container>
      {ready && gameState ? (
        <>
          <Header>
            <Instruction>{gameState.nextPlayer}'s turn!</Instruction>
          </Header>
          <PlayArea>
            <input
              type="image"
              id="drawButton"
              disabled={!gameState.canDraw}
              onClick={() => DrawCard(gameState)}
              src={gameState.deckImg}
            ></input>
            <img src={gameState.topCardImg}></img>
          </PlayArea>
          <Footer>
            <img src={gameState.beerImg}></img>
            <h1>Cards Drawn: {gameState.drawn.length - 1}</h1>
            <Button id="shuffle" onClick={() => ShuffleDeck(gameState)}>
              Shuffle Deck
            </Button>
          </Footer>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}
