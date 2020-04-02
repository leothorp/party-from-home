import React, { createContext, ReactChild } from 'react';

export interface EphemeralOverlayProps {
  participantId: string;
}

export const EphemeralOverlayContext = createContext({} as EphemeralOverlayProps);

interface ProviderProps {
  participantId: string;
  children: ReactChild | ReactChild[];
}

export default function EphemeralOverlayProvider(props: ProviderProps) {
  const ephemeralOverlayContext = {
    participantId: props.participantId,
  };

  return (
    <EphemeralOverlayContext.Provider value={ephemeralOverlayContext}>
      {props.children}
    </EphemeralOverlayContext.Provider>
  );
}
