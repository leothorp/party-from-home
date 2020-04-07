import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Pin } from '@primer/octicons-react';
import PinIcon from './PinIcon';
import useSelectedParticipant from '../../../../VideoProvider/useSelectedParticipant/useSelectedParticipant';

const mockIdentity = { identity: 'mockIdentity' };

jest.mock('../../../../../hooks/overlayHooks/useUserInfoOverlayContext', () => () => ({ participant: mockIdentity }));
jest.mock('../../../../VideoProvider/useSelectedParticipant/useSelectedParticipant');

const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  const getWrapper = (overrides?: object) => shallow(<PinIcon {...overrides} />);

  it('displays the correct components', () => {
    mockUseSelectedParticipant.mockImplementation(() => [mockIdentity]);
    const wrapper = getWrapper();
    expect(wrapper.find(Pin)).toHaveLength(1);
    expect(wrapper.find(Tooltip)).toHaveLength(1);
    expect(wrapper.find(SvgIcon)).toHaveLength(1);
  });

  it('does not display pin if the user is not selected', () => {
    mockUseSelectedParticipant.mockImplementation(() => []);
    const wrapper = getWrapper();
    expect(wrapper.find(Pin)).toHaveLength(0);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(0);
  });
});
