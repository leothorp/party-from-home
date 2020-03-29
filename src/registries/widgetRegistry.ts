import { FunctionComponent } from 'react';
import { GameSpaceOverlayType } from '../Overlay';
import KingsCup from '../components/Widgets/KingsCup';
import DrawingWidget from '../components/Widgets/DrawingWidget';
import Charades from '../components/Widgets/Charades';

export interface WidgetRegistration {
  name: string;
  component: FunctionComponent;
  overlay?: GameSpaceOverlayType;
  description: string;
}

export interface WidgetRegistry {
  [key: string]: WidgetRegistration;
}

export default {
  kingscup: {
    name: "King's Cup",
    component: KingsCup,
    description: "Yea, it's actually King's Cup... the drinking game...",
  },
  drawing: {
    name: 'Whiteboard',
    component: DrawingWidget,
    description: 'A white board, can be used for games like Pictionary!',
  },
  charades: {
    name: 'Charades',
    component: Charades,
    description: 'Charades with your friends!',
  },
} as WidgetRegistry;
