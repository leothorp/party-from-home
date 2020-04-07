import React, { createContext, ReactChild } from 'react';

export interface GameSpaceOverlayProps {
  participantId: string;
}

export const GameSpaceOverlayContext = createContext({} as GameSpaceOverlayProps);

interface ProviderProps {
  participantId: string;
  children: ReactChild | ReactChild[];
}

export default function GameSpaceOverlayProvider(props: ProviderProps) {
  const gameSpaceOverlayContext = {
    participantId: props.participantId,
  };

  return (
    <GameSpaceOverlayContext.Provider value={gameSpaceOverlayContext}>
      {props.children}
    </GameSpaceOverlayContext.Provider>
  );
}
