import React from 'react';
import registry from '../../widgetRegistry';
import RoomWidgetProvider from './RoomWidgetProvider';

interface Props {
    widgetId: string;
    documentId: string;
}

export default function RoomWidget(props: Props) {
    const Widget = registry[props.widgetId];

    return (
        <RoomWidgetProvider documentId={props.documentId}>
            <Widget />
        </RoomWidgetProvider>
    );
}
