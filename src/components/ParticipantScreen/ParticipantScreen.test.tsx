import React from 'react';
import ParticipantScreen from './index';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import UserInfoOverlayArea from './Overlays/UserInfoOverlays/UserInfoOverlayArea';

jest.mock('../../hooks/usePublications/usePublications');
jest.mock('../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock<any>;

describe('the ParticipantInfo component', () => {
  it('renders the UserInfoOverlayArea', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantScreen onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantScreen>
    );
    expect(wrapper.find(UserInfoOverlayArea)).toHaveLength(1);
  });

  it('should add hideVideoProp to InfoContainer component when no video tracks are published', () => {
    mockUsePublications.mockImplementation(() => []);
    const wrapper = shallow(
      <ParticipantScreen onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantScreen>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).toContain('hideVideo');
  });

  it('should not add hideVideoProp to InfoContainer component when a video track is published', () => {
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantScreen onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantScreen>
    );
    expect(wrapper.find('.makeStyles-infoContainer-3').prop('className')).not.toContain('hideVideo');
  });

  it('should add isSwitchedOff prop to Container component when video is switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantScreen onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantScreen>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).toContain('isVideoSwitchedOff');
  });

  it('should not add isSwitchedOff prop to Container component when video is not switched off', () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [{ trackName: 'camera' }]);
    const wrapper = shallow(
      <ParticipantScreen onClick={() => {}} isSelected={false} participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantScreen>
    );
    expect(wrapper.find('.makeStyles-container-1').prop('className')).not.toContain('isVideoSwitchedOff');
  });
});
