import { UserInfoOverlayType } from '../Overlay';
import { USER_INFO_OVERLAY_TYPES } from '../constants/registryContants';
import UserAndConnectionInfo from '../components/ParticipantScreen/Overlays/UserInfoOverlays/UserAndConnectionInfo';
import VideoAndAudioInfo from '../components/ParticipantScreen/Overlays/UserInfoOverlays/VideoAndAudioInfo';

export interface UserInfoOverlayRegistry {
  [key: string]: UserInfoOverlayType;
}

export default {
  [USER_INFO_OVERLAY_TYPES.USER_AND_CONNECTION_INFO]: {
    component: UserAndConnectionInfo,
  },
  [USER_INFO_OVERLAY_TYPES.VIDEO_AND_AUDIO_INFO]: {
    component: VideoAndAudioInfo,
  },
  // FILL MORE IN...
} as UserInfoOverlayRegistry;
