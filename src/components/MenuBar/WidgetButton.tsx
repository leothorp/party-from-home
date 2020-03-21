import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import { Casino, CasinoOutlined } from '@material-ui/icons';
import useApi from '../../hooks/useApi/useApi';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';

export default function WidgetButton() {
  const { callApi } = useApi();
  const room = useCurrentRoom();

  const select = useCallback(() => {
    if (room && !room.widgetId) {
      callApi('create_widget_state', {
        roomId: room.id,
        widgetId: 'test',
      }).catch(e => console.error(e));
    }
  }, [callApi, room]);

  const remove = useCallback(() => {
    if (room) {
      callApi('delete_widget_state', {
        roomId: room.id,
      }).catch(e => console.error(e));
    }
  }, [callApi, room]);

  return (
    <div>
      {room?.widgetId ? (
        <IconButton onClick={remove}>
          <CasinoOutlined />
        </IconButton>
      ) : (
        <IconButton onClick={select}>
          <Casino />
        </IconButton>
      )}
    </div>
  );
}
