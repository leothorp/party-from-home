import React, { useCallback, useState } from 'react';
import { IconButton, Modal, styled } from '@material-ui/core';
import { Casino, CasinoOutlined } from '@material-ui/icons';
import useApi from '../../hooks/useApi/useApi';
import useCurrentRoom from '../../hooks/useCurrentRoom/useCurrentRoom';
import registry, { WidgetRegistration } from '../../registries/widgetRegistry';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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
  borderBottomColor: '#000',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
}));

const WidgetInfoTitle = styled('p')(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
}));

const WidgetInfoDescription = styled('p')(({ theme }) => ({}));

const SET_WIDGET = gql`
  mutation SetRoomWidget($roomId: String!, $widgetId: String!) {
    setRoomWidget(id: $roomId, widgetId: $widgetId) {
      id
      widgetId
      widgetState
    }
  }
`;

const REMOVE_WIDGET = gql`
  mutation RemoveRoomWidget($roomId: String!) {
    removeRoomWidget(id: $roomId) {
      id
      widgetId
      widgetState
    }
  }
`;

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
  const room = useCurrentRoom();
  const [open, setOpen] = useState(false);
  const [setRoomWidget] = useMutation(SET_WIDGET);
  const [removeRoomWidget] = useMutation(REMOVE_WIDGET);

  const select = useCallback(
    (widgetId: string) => {
      if (room && !room.widgetId) {
        setRoomWidget({
          variables: { roomId: room.id, widgetId },
        });
      }

      setOpen(false);
    },
    [room, setRoomWidget]
  );

  const remove = useCallback(() => {
    if (room) {
      removeRoomWidget({
        variables: { roomId: room.id },
      });
    }
  }, [removeRoomWidget, room]);

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
        <IconButton onClick={openSelector} disabled={props.disabled}>
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
