import React from 'react';
import { REACTION_EMOJI_TYPES } from '../../../../../constants/reactionConstants';

export default function ReactionEmojiComponent({ reactionType }: { reactionType: string }) {
  const REACTION_TYPE_TO_EMOJI: { [key: string]: React.ReactNode } = {
    [REACTION_EMOJI_TYPES.CLAP]: (
      <span role="img" aria-label="user-reaction">
        👏
      </span>
    ),
    [REACTION_EMOJI_TYPES.LAUGH]: (
      <span role="img" aria-label="user-reaction">
        😂
      </span>
    ),
    [REACTION_EMOJI_TYPES.PARTY]: (
      <span role="img" aria-label="user-reaction">
        🎉
      </span>
    ),
  };

  return <>{REACTION_TYPE_TO_EMOJI[reactionType]}</>;
}
