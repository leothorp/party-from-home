import React, { useCallback } from 'react';
import useApi from '../../hooks/useApi/useApi';
import { Button } from '@material-ui/core';

export interface Props {
  room: any;
  onWidgetSelected: (widgetId: string, widgetStateId: string) => void;
}

export default function WidgetSelector(props: Props) {
  const { callApi } = useApi();

  const select = useCallback(() => {
    if (!props.room.widgetId) {
      callApi('create_widget_state', {
        roomId: props.room.id,
        widgetId: 'test-widget',
      }).then(data => {
        props.onWidgetSelected('test-widget', data.widgetStateId);
      });
    }
  }, [callApi, props]);

  return (
    <div>
      <Button onClick={select}>Add Widget</Button>
    </div>
  );
}
