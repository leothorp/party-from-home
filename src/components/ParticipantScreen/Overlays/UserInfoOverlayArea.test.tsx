import React from 'react';
import { shallow } from 'enzyme';
import UserInfoOverlayArea from './UserInfoOverlayArea';
import UserInfoOverlay from './UserInfoOverlays/UserInfoOverlay';

describe('the ParticipantInfo component', () => {
  const mockIdentity = { identity: 'mockIdentity' };
  const defaultProps = {
    participant: mockIdentity as any,
  };
  const getWrapper = (overrides?: object) => shallow(<UserInfoOverlayArea {...defaultProps} {...overrides} />);

  it('renders correct components', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(UserInfoOverlay)).toHaveLength(4);
  });
});
