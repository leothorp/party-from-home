import React from 'react';
import { shallow } from 'enzyme';
import VideoAndAudioInfo from './index';
import usePublications from '../../../../../hooks/usePublications/usePublications';

const mockIdentity = { identity: 'mockIdentity' };

jest.mock('../../../../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel', () => () => 4);
jest.mock('../../../../../hooks/overlayHooks/useUserInfoOverlayContext', () => () => ({ participant: mockIdentity }));
jest.mock('../../../../../hooks/usePublications/usePublications');
jest.mock('../../../../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');

const mockUsePublications = usePublications as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  const getWrapper = (overrides?: object) => shallow(<VideoAndAudioInfo {...overrides} />);

  it('should display MicOff icon when no audio tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = getWrapper();
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should not display MicOff icon when an audio track is published', () => {
    mockUsePublications.mockImplementation(() => [{ kind: 'audio', isTrackEnabled: true }]);
    const wrapper = getWrapper();
    expect(wrapper.find('MicOffIcon').exists()).toEqual(false);
  });

  it('should not display MicOff icon when an audio track is published and not enabled', () => {
    mockUsePublications.mockImplementation(() => [{ kind: 'audio', isTrackEnabled: false }]);
    const wrapper = getWrapper();
    expect(wrapper.find('MicOffIcon').exists()).toEqual(true);
  });

  it('should render a VideoCamOff icon when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = getWrapper();
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(true);
  });

  it('should not render a VideoCamOff icon when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = getWrapper();
    expect(wrapper.find('VideocamOffIcon').exists()).toEqual(false);
  });

  it('should display ScreenShare icon when participant has published a screen share track', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'screen' }]);
    const wrapper = getWrapper();
    expect(wrapper.find('ScreenShareIcon').exists()).toEqual(true);
  });

  it('should not display ScreenShare icon when participant has not published a screen share track', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = getWrapper();
    expect(wrapper.find('ScreenShareIcon').exists()).toEqual(false);
  });
});
