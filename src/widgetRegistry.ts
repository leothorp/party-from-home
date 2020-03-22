import { FunctionComponent } from 'react';
import TestWidget from './components/Widgets/TestWidget';
import KingsCup from './components/Widgets/KingsCup';

export interface WidgetRegistration {
  name: string;
  component: FunctionComponent;
  description: string;
}

export interface WidgetRegistry {
  [key: string]: WidgetRegistration;
}

export default {
  test: {
    name: 'Test Widget',
    component: TestWidget,
    description: 'A test widget, temporary',
  },
  kingscup: {
    name: 'Kings Cup',
    component: KingsCup,
    description: "Yea, it's actually King's Cup... the drinking game...",
  },
} as WidgetRegistry;
