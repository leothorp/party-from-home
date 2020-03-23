import React, { useCallback } from 'react';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';
import { styled } from '@material-ui/core';
import DrawingCanvas from './Drawing.js';

const Container = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  color: 'white',
});

export default function TestWidget() {
  const { state, setState, ready } = useWidgetContext({ canvasData: {} });

  const onChange = useCallback(
    (canvas: any) => {
      const newState = { canvasData: canvas.getSaveData() };
      setState(newState);
    },
    [setState]
  );

  if (ready) {
    return (
      <Container>
        <DrawingCanvas onChange={onChange} data={state.canvasData} />
      </Container>
    );
  } else {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }
}
