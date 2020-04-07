import { FunctionComponent } from 'react';

export interface UserInfoOverlayDefinition {
  id: string;
  component: FunctionComponent;
}

export interface EphemeralOverlayDefinition {
  id: string;
  component: FunctionComponent;
}

export interface GameSpaceOverlayDefinition {
  id: string;
  component: FunctionComponent;
}

export interface BorderOverlayDefinition {
  id: string;
  color: string;
  text?: string;
}

export interface Overlays {
  userInfoOverlays: UserInfoOverlayDefinition[];
  ephemeralOverlays: EphemeralOverlayDefinition[];
  gameSpaceOverlay: GameSpaceOverlayDefinition | undefined;
  borderOverlays: BorderOverlayDefinition[];
}
