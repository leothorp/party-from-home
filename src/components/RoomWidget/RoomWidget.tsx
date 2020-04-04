import React from 'react';
import registry from '../../registries/widgetRegistry';
import RoomWidgetProvider from './RoomWidgetProvider';

interface Props {
  widgetId: string;
  roomId: string;
}

export default function RoomWidget(props: Props) {
  const widgetInfo = registry[props.widgetId];
  const Widget = widgetInfo.component;

  return (
    <RoomWidgetProvider roomId={props.roomId}>
      <Widget />
    </RoomWidgetProvider>
  );
}
