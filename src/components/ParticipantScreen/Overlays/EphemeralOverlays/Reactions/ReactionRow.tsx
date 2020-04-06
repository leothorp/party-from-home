import React from 'react';
import { styled } from '@material-ui/core';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import useSelectedParticipant from '../../../../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useUserInfoOverlayContext from '../../../../../hooks/overlayHooks/useUserInfoOverlayContext';
import ReactionEmojiComponent from './ReactionEmojiComponent';

const ReactionContainer = styled('div')({
  float: 'right',
  height: '24px',
});

export default function ReactionRow({ reactionType }: { reactionType?: string }) {
  const {
    participant,
  }: { participant: LocalParticipant | RemoteParticipant | undefined } = useUserInfoOverlayContext();
  const [selectedParticipant] = useSelectedParticipant();

  if (!reactionType) {
    return null;
  }

  return (
    <ReactionContainer>
      <ReactionEmojiComponent reactionType={reactionType} />
    </ReactionContainer>
  );
}
