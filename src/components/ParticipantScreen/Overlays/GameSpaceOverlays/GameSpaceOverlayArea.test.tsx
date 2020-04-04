import React from 'react';
import { shallow } from 'enzyme';
import GameSpaceOverlayArea from './GameSpaceOverlayArea';
import GameSpaceOverlay from './GameSpaceOverlay';

describe('the GameSpaceOverlayArea component', () => {
  const mockIdentity = { identity: 'mockIdentity' };
  const defaultProps = {
    participant: mockIdentity as any,
    overlay: {
      id: 'fakeOverlay',
      component: () => <div />,
    },
  };
  const getWrapper = (overrides?: object) => shallow(<GameSpaceOverlayArea {...defaultProps} {...overrides} />);

  it('renders correct components', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(GameSpaceOverlay)).toHaveLength(1);
  });
});
