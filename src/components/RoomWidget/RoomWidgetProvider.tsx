import React, { createContext, ReactChild } from 'react';

export interface RoomWidgetProps {
  documentId: string;
}

export const RoomWidgetContext = createContext({} as RoomWidgetProps);

interface ProviderProps {
  documentId: string;
  children: ReactChild | ReactChild[];
}

export default function RoomWidgetProvider(props: ProviderProps) {
  const widgetContext = {
    documentId: props.documentId,
  };

  return <RoomWidgetContext.Provider value={widgetContext}>{props.children}</RoomWidgetContext.Provider>;
}
