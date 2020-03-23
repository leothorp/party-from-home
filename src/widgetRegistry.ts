import { FunctionComponent } from 'react';
import KingsCup from './components/Widgets/KingsCup';
import DrawingWidget from './components/Widgets/DrawingWidget';

export interface WidgetRegistration {
  name: string;
  component: FunctionComponent;
  description: string;
}

export interface WidgetRegistry {
  [key: string]: WidgetRegistration;
}

export default {
  kingscup: {
    name: 'Kings Cup',
    component: KingsCup,
    description: "Yea, it's actually King's Cup... the drinking game...",
  },
  drawing: {
    name: 'Whiteboard',
    component: DrawingWidget,
    description: 'A white board, can be used for games like Pictionary!',
  },
} as WidgetRegistry;
