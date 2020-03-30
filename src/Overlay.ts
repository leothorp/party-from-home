import { FunctionComponent } from 'react';

export interface UserInfoOverlayDefinition {
  id: string;
  component: FunctionComponent;
}

export interface EphemeralOverlayDefinition {
  component: FunctionComponent;
}

export interface GameSpaceOverlayDefinition {
  component: FunctionComponent;
}

export interface BorderOverlayDefinition {
  color: string;
  text?: string;
}

export interface Overlays {
  userInfoOverlays: UserInfoOverlayDefinition[];
  ephemeralOverlays: EphemeralOverlayDefinition[];
  gameSpaceOverlay: GameSpaceOverlayDefinition | undefined;
  borderOverlays: BorderOverlayDefinition[];
}
