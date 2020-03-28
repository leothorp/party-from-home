import { FunctionComponent } from 'react';

export interface UserInfoOverlay {
  id: string;
  component: FunctionComponent;
}

export interface EphemeralOverlay {
  id: string;
  component: FunctionComponent;
}

export interface GameSpaceOverlay {
  id: string;
  component: FunctionComponent;
}

export interface BorderOverlay {
  id: string;
  color: string;
  text?: string;
}

export interface Overlays {
  userInfoOverlays: UserInfoOverlay[];
  ephemeralOverlays: EphemeralOverlay[];
  gameSpaceOverlay: GameSpaceOverlay | undefined;
  borderOverlays: BorderOverlay[];
}
