import React from 'react';
import renderer from 'react-test-renderer';
import NetworkQualityLevel from './NetworkQualityLevel';

describe('the NetworkQualityLevel component', () => {
  it('should render correctly for level 5', () => {
    const tree = renderer.create(<NetworkQualityLevel participant={{ networkQualityLevel: 5 } as any} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly for level 3', () => {
    const tree = renderer.create(<NetworkQualityLevel participant={{ networkQualityLevel: 3 } as any} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly for level 0', () => {
    const tree = renderer.create(<NetworkQualityLevel participant={{ networkQualityLevel: 0 } as any} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
