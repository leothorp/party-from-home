import React, { useCallback, useState } from 'react';
import { IconButton, Modal, styled, Popover } from '@material-ui/core';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import ReactionEmojiComponent from '../ParticipantScreen/Overlays/EphemeralOverlays/Reactions/ReactionEmojiComponent';
import { REACTION_EMOJI_TYPES } from '../../constants/reactionConstants';
import { EPHEMERAL_OVERLAY_TYPES } from '../../constants/registryContants';

const SelectorContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.alternateBackgroundColor,
  maxWidth: '200px',
  padding: '25px',
  outline: 'none',
}));

const Title = styled('p')({
  fontSize: '16px',
  fontWeight: 'bold',
  margin: 0,
  marginBottom: '4px',
});

const EmojisContainer = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const EmojiContainer = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: '8px',
  display: 'inline-block',
  fontSize: '24px',
}));

const SEND_REACTION_PUBLICATION = gql`
  mutation SendEphemeralPublication($ephemeralType: String!, $metadata: EphemeralMetadataInput!) {
    sendEphemeralPublication(ephemeralType: $ephemeralType, metadata: $metadata) {
      userId
      ephemeralType
      metadata {
        reactionType
      }
    }
  }
`;

interface ReactionSelectionProps {
  reactionType: string;
  onClick: (id: string) => void;
}

const ReactionSelection = ({ onClick, reactionType }: ReactionSelectionProps) => {
  const handleClick = useCallback(() => {
    onClick(reactionType);
  }, [onClick, reactionType]);

  return (
    <EmojiContainer onClick={handleClick}>
      <ReactionEmojiComponent reactionType={reactionType} />
    </EmojiContainer>
  );
};

export interface Props {
  disabled?: boolean;
}

export default function SendReactionButton(props: Props) {
  const [sendEphemeralPublication] = useMutation(SEND_REACTION_PUBLICATION);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const reactionPopOverId = 'reaction-selector-popover';
  const open = Boolean(anchorEl);
  const id = open ? reactionPopOverId : undefined;

  const select = useCallback(
    (reactionType: string) => {
      sendEphemeralPublication({
        variables: { ephemeralType: EPHEMERAL_OVERLAY_TYPES.REACTIONS, metadata: { reactionType } },
      });
      handleClose();
    },
    [sendEphemeralPublication]
  );

  const openSelector = useCallback(e => {
    handleOpen(e);
  }, []);

  var reactionSelections = [];

  for (const reactionType in REACTION_EMOJI_TYPES) {
    reactionSelections.push(<ReactionSelection key={reactionType} reactionType={reactionType} onClick={select} />);
  }

  return (
    <div>
      <IconButton aria-describedby={reactionPopOverId} onClick={openSelector} disabled={props.disabled}>
        <ReactionEmojiComponent reactionType={REACTION_EMOJI_TYPES.PARTY} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
          <SelectorContainer>
            <Title>Send a reaction!</Title>
            <EmojisContainer>{reactionSelections}</EmojisContainer>
          </SelectorContainer>
        </div>
      </Popover>
    </div>
  );
}
