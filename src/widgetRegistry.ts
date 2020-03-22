import { FunctionComponent } from 'react';
import TestWidget from './components/Widgets/TestWidget';

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
} as WidgetRegistry;
