import React from 'react';
import { shallow } from 'enzyme';
import UserInfoOverlayArea from './UserInfoOverlayArea';
import UserInfoOverlay from './UserInfoOverlay';
import { USER_INFO_OVERLAY_TYPES } from '../../../../constants/registryContants';
import userInfoOverlayRegistry from '../../../../registries/userInfoOverlayRegistry';

describe('the UserInfoOverlayArea component', () => {
  const mockIdentity = { identity: 'mockIdentity' };
  const defaultProps = {
    participant: mockIdentity as any,
    overlays: [
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.USER_AND_CONNECTION_INFO],
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.NETWORK_QUALITY_LEVEL],
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.VIDEO_AND_AUDIO_INFO],
      userInfoOverlayRegistry[USER_INFO_OVERLAY_TYPES.PIN_ICON],
    ],
  };
  const getWrapper = (overrides?: object) => shallow(<UserInfoOverlayArea {...defaultProps} {...overrides} />);

  it('renders correct components', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(UserInfoOverlay)).toHaveLength(4);
  });
});
