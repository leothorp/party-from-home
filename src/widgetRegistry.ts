import { FunctionComponent } from 'react';
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
  kingscup: {
    name: 'Kings Cup',
    component: KingsCup,
    description: "Yea, it's actually King's Cup... the drinking game...",
  },
} as WidgetRegistry;
