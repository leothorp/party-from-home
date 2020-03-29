import EventEmitter from 'events';
import React from 'react';
import ParticipantStrip from './ParticipantStrip';
import { shallow } from 'enzyme';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../VideoProvider/useSelectedParticipant/useSelectedParticipant');
const mockedVideoContext = useVideoContext as jest.Mock<any>;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock<any>;

describe('the ParticipantStrip component', () => {
  mockUseSelectedParticipant.mockImplementation(() => [null, () => {}]);

  it('should correctly render ParticipantInfo components', () => {
    const mockRoom: any = new EventEmitter();
    mockRoom.participants = new Map([
      [0, { sid: 0 }],
      [1, { sid: 1 }],
    ]);
    mockRoom.localParticipant = 'localParticipant';
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    const wrapper = shallow(<ParticipantStrip />);
    expect(wrapper).toMatchSnapshot();
  });
});
