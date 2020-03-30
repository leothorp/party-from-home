import React from 'react';
import registry from '../../registries/widgetRegistry';
import RoomWidgetProvider from './RoomWidgetProvider';

interface Props {
  widgetId: string;
  documentId: string;
}

export default function RoomWidget(props: Props) {
  const widgetInfo = registry[props.widgetId];
  const Widget = widgetInfo.component;

  return (
    <RoomWidgetProvider documentId={props.documentId}>
      <Widget />
    </RoomWidgetProvider>
  );
}
