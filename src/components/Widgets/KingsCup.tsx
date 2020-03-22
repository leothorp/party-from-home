import React, { useEffect } from 'react';
import { styled } from '@material-ui/core';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';

const Container = styled('div')({
  display: 'flex',
  alignContent: 'center',
  backgroundColor: 'darkgreen',
  height: '100%',
});

const Column = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '25%',
  '& img': {
    alignSelf: 'center',
    maxWidth: '100%',
  },
  '& input': {
    maxWidth: '100%',
  },
});

const Row = styled('div')({
  display: 'flex',
  alignContent: 'center',
});

const Instruction = styled('h1')({
  textAlign: 'center',
});

export default function KingsCup() {
  const { participants, state: gameState, setState: setGameState } = useWidgetContext({
    deck: [
      '2c',
      '2d',
      '2s',
      '2h',
      '3c',
      '3d',
      '3s',
      '3h',
      '4c',
      '4d',
      '4s',
      '4h',
      '5c',
      '5d',
      '5s',
      '5h',
      '6c',
      '6d',
      '6s',
      '6h',
      '7c',
      '7d',
      '7s',
      '7h',
      '8c',
      '8d',
      '8s',
      '8h',
      '9c',
      '9d',
      '9s',
      '9h',
      '10c',
      '10d',
      '10s',
      '10h',
      'jc',
      'jd',
      'js',
      'jh',
      'qc',
      'qd',
      'qs',
      'qh',
      'kc',
      'kd',
      'ks',
      'kh',
      'ac',
      'ad',
      'as',
      'ah',
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
      '2c',
      '2d',
      '2s',
      '2h',
      '3c',
      '3d',
      '3s',
      '3h',
      '4c',
      '4d',
      '4s',
      '4h',
      '5c',
      '5d',
      '5s',
      '5h',
      '6c',
      '6d',
      '6s',
      '6h',
      '7c',
      '7d',
      '7s',
      '7h',
      '8c',
      '8d',
      '8s',
      '8h',
      '9c',
      '9d',
      '9s',
      '9h',
      '10c',
      '10d',
      '10s',
      '10h',
      'jc',
      'jd',
      'js',
      'jh',
      'qc',
      'qd',
      'qs',
      'qh',
      'kc',
      'kd',
      'ks',
      'kh',
      'ac',
      'ad',
      'as',
      'ah',
    ];
    var deckImg = '/images/cards/deck.png';
    var canDraw = true;
    var drawn = [''];
    var topCardImg = '/images/cards/empty.png';
    var players = participants;
    if (players.length < 1) players = [{ uid: '', displayName: '' }];
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
      {gameState && gameState.beerImg ? (
        <>
          <Column>
            <Instruction>{gameState.nextPlayer}'s turn!</Instruction>
          </Column>
          <Column>
            <input
              type="image"
              id="drawButton"
              disabled={!gameState.canDraw}
              onClick={() => DrawCard(gameState)}
              src={gameState.deckImg}
            ></input>
          </Column>
          <Column>
            <img src={gameState.topCardImg}></img>
          </Column>
          <Column>
            <Row>
              <img src={gameState.beerImg}></img>
            </Row>
            <Row>
              <h1>Cards Drawn: {gameState.drawn.length - 1}</h1>
            </Row>
            <Row>
              <button id="shuffle" onClick={() => ShuffleDeck(gameState)}>
                Shuffle Deck
              </button>
            </Row>
          </Column>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}
