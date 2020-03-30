import React from 'react';
import renderer from 'react-test-renderer';
import NetworkQualityLevel from './NetworkQualityLevel';
import useParticipantNetworkQualityLevel from '../../../../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';

const mockIdentity = { identity: 'mockIdentity' };

jest.mock('../../../../../hooks/overlayHooks/useUserInfoOverlayContext', () => () => ({ participant: mockIdentity }));
jest.mock('../../../../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel');

const mockUseParticipantNetworkQualityLevel = useParticipantNetworkQualityLevel as jest.Mock<any>;

describe('the NetworkQualityLevel component', () => {
  it('should render correctly for level 5', () => {
    mockUseParticipantNetworkQualityLevel.mockImplementation(() => 5);
    const tree = renderer.create(<NetworkQualityLevel />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly for level 3', () => {
    mockUseParticipantNetworkQualityLevel.mockImplementation(() => 3);
    const tree = renderer.create(<NetworkQualityLevel />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly for level 0', () => {
    mockUseParticipantNetworkQualityLevel.mockImplementation(() => 0);
    const tree = renderer.create(<NetworkQualityLevel />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
