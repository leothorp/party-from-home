// Reaction emoji Constants
export enum REACTION_EMOJI_TYPES {
  CLAP = 'CLAP',
  PARTY = 'PARTY',
  LAUGH = 'LAUGH',
}

export interface ReactionMetadata {
  reactionType: string;
}
