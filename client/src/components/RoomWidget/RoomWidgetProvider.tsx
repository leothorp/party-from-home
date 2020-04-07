import React, { createContext, ReactChild } from 'react';

export interface RoomWidgetProps {
  roomId: string;
}

export const RoomWidgetContext = createContext({} as RoomWidgetProps);

interface ProviderProps {
  roomId: string;
  children: ReactChild | ReactChild[];
}

export default function RoomWidgetProvider(props: ProviderProps) {
  const widgetContext = {
    roomId: props.roomId,
  };

  return <RoomWidgetContext.Provider value={widgetContext}>{props.children}</RoomWidgetContext.Provider>;
}
