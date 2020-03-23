import React, { useCallback, useRef } from 'react';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';
import { styled, Button } from '@material-ui/core';
import DrawingCanvas from './Drawing.js';

const Container = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  color: 'white',
});

export default function TestWidget() {
  const { state, setState, ready } = useWidgetContext({ canvasData: {} });
  const canvasRef = useRef<any | null>(null);

  const onChange = useCallback(
    (canvas: any) => {
      const newState = { canvasData: canvas.getSaveData() };
      setState(newState);
    },
    [setState]
  );

  const onClear = useCallback(() => {
    canvasRef.current?.clear();
  }, [canvasRef]);

  const onUndo = useCallback(() => {
    canvasRef.current?.undo();
  }, [canvasRef]);

  if (ready) {
    return (
      <Container>
        <DrawingCanvas ref={canvasRef} onChange={onChange} data={state.canvasData} lazyRadius={0} />
        <Button onClick={onUndo}>Undo</Button>
        <Button onClick={onClear}>Clear</Button>
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
