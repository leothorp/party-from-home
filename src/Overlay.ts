import { FunctionComponent } from 'react';

export interface UserInfoOverlayType {
  component: FunctionComponent;
}

export interface EphemeralOverlayType {
  component: FunctionComponent;
}

export interface GameSpaceOverlayType {
  component: FunctionComponent;
}

export interface BorderOverlayType {
  color: string;
  text?: string;
}

export interface Overlays {
  userInfoOverlays: UserInfoOverlayType[];
  ephemeralOverlays: EphemeralOverlayType[];
  gameSpaceOverlay: GameSpaceOverlayType | undefined;
  borderOverlays: BorderOverlayType[];
}
