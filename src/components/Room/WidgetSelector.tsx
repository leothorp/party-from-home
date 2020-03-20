import React, { useCallback } from 'react';
import useApi from '../../hooks/useApi/useApi';
import { Button } from '@material-ui/core';
import { styled } from '@material-ui/core';


const Container = styled('div')(({ theme }) => ({
  backgroundColor: '#000',
  padding: '10px',
}));

export interface Props {
  room: any;
  onWidgetSelected: (widgetId: string, widgetStateId: string) => void;
}

export default function WidgetSelector(props: Props) {
  const { callApi } = useApi();

  const select = useCallback(() => {
    if (props.room && !props.room.widgetId) {
      callApi('create_widget_state', {
        roomId: props.room.id,
        widgetId: 'test-widget',
      }).then(data => {
        props.onWidgetSelected('test-widget', data.widgetStateId);
      });
    }
  }, [callApi, props]);

  return (
    <Container>
      <Button onClick={select}>Add Widget</Button>
    </Container>
  );
}
