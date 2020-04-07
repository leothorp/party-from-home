import React from 'react';
import { shallow } from 'enzyme';
import EphemeralOverlayArea from './EphemeralOverlayArea';
import EphemeralOverlay from './EphemeralOverlay';

describe('the EphemeralOverlayArea component', () => {
  const mockIdentity = { identity: 'mockIdentity' };
  const defaultProps = {
    participant: mockIdentity as any,
    overlays: [
      {
        id: 'fakeOverlay',
        component: () => <div />,
      },
      {
        id: 'fakeOverlay2',
        component: () => <div />,
      },
    ],
  };
  const getWrapper = (overrides?: object) => shallow(<EphemeralOverlayArea {...defaultProps} {...overrides} />);

  it('renders correct components', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(EphemeralOverlay)).toHaveLength(2);
  });
});
