import React, { useCallback } from 'react';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';
import { Button } from '@material-ui/core';
import { styled } from '@material-ui/core';

const Container = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  color: 'white',
});

export default function TestWidget() {
  const { state, setState } = useWidgetContext({ counter: 0 });

  const increment = useCallback(() => {
    setState({
      counter: state.counter + 1,
    });
  }, [setState, state]);

  return (
    <Container>
      <p>Count: {state?.counter}</p>
      <Button onClick={increment}>Add 1</Button>
    </Container>
  );
}
