import React, { useCallback, useState } from 'react';
import { IconButton, Modal, styled } from '@material-ui/core';
import { Casino, CasinoOutlined } from '@material-ui/icons';
import useApi from '../../hooks/useApi/useApi';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import registry, { WidgetRegistration } from '../../widgetRegistry';

const SelectorContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: theme.alternateBackgroundColor,
  width: '400px',
  height: '500px',
  marginTop: '-250px',
  marginLeft: '-200px',
  display: 'flex',
  flexDirection: 'column',
  padding: '25px',
  outline: 'none',
}));

const Title = styled('p')({
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: 0,
  marginBottom: '16px',
});

const WidgetInfoContainer = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  padding: '16px',
}));

const WidgetInfoTitle = styled('p')(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
}));

const WidgetInfoDescription = styled('p')(({ theme }) => ({}));

interface WidgetInfoProps {
  id: string;
  widget: WidgetRegistration;
  onClick: (id: string) => void;
}

const WidgetInfo = (props: WidgetInfoProps) => {
  const onClick = useCallback(() => {
    props.onClick(props.id);
  }, [props]);

  return (
    <WidgetInfoContainer onClick={onClick}>
      <WidgetInfoTitle>{props.widget.name}</WidgetInfoTitle>
      <WidgetInfoDescription>{props.widget.description}</WidgetInfoDescription>
    </WidgetInfoContainer>
  );
};

export interface Props {
  disabled?: boolean;
}

export default function WidgetButton(props: Props) {
  const { callApi } = useApi();
  const room = useCurrentRoom();
  const [open, setOpen] = useState(false);

  const select = useCallback(
    (widgetId: string) => {
      if (room && !room.widgetId) {
        callApi('create_widget_state', {
          roomId: room.id,
          widgetId,
        }).catch(e => console.error(e));
      }

      setOpen(false);
    },
    [callApi, room]
  );

  const remove = useCallback(() => {
    if (room) {
      callApi('delete_widget_state', {
        roomId: room.id,
      }).catch(e => console.error(e));
    }
  }, [callApi, room]);

  const openSelector = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  var widgets = [];

  for (const id in registry) {
    widgets.push(<WidgetInfo key={id} id={id} widget={registry[id]} onClick={select} />);
  }

  return (
    <div>
      {room?.widgetId ? (
        <IconButton onClick={remove} disabled={props.disabled}>
          <CasinoOutlined />
        </IconButton>
      ) : (
        <IconButton onClick={openSelector}>
          <Casino />
        </IconButton>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <SelectorContainer>
          <Title>Select a game to play!</Title>
          {widgets}
        </SelectorContainer>
      </Modal>
    </div>
  );
}
