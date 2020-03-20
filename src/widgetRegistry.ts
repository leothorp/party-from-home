import { FunctionComponent } from 'react';

export interface WidgetRegistry {
    [key: string]: FunctionComponent,
}

export default {
} as WidgetRegistry;