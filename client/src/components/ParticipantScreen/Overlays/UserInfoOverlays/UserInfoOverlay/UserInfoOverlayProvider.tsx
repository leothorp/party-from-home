import React, { createContext, ReactChild } from 'react';

export interface UserInfoOverlayProps {
  participantId: string;
}

export const UserInfoOverlayContext = createContext({} as UserInfoOverlayProps);

interface ProviderProps {
  participantId: string;
  children: ReactChild | ReactChild[];
}

export default function UserInfoOverlayProvider(props: ProviderProps) {
  const userInfoOverlayContext = {
    participantId: props.participantId,
  };

  return (
    <UserInfoOverlayContext.Provider value={userInfoOverlayContext}>{props.children}</UserInfoOverlayContext.Provider>
  );
}
