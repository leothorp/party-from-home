import React, { useCallback, useRef, useState } from 'react';
import useWidgetContext from '../../hooks/useWidgetContext/useWidgetContext';
import { styled, Button } from '@material-ui/core';
import DrawingCanvas from './DrawingCanvas.js';

const Container = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  color: 'white',
});

export default function TestWidget() {
  const { state, setState, ready } = useWidgetContext({ canvasData: { lines: [] } });
  const canvasRef = useRef<any | null>(null);
  const containerRef = useRef<any | null>(null);
  const [lazyBrush, setLazyBrush] = useState(false);

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
      <Container ref={containerRef}>
        <DrawingCanvas
          ref={canvasRef}
          onChange={onChange}
          data={state.canvasData}
          lazyRadius={lazyBrush ? 12 : 0}
          canvasWidth={containerRef.current?.offsetWidth}
          canvasHeight={containerRef.current ? containerRef.current.offsetHeight - 24 : undefined}
        />
        <Button onClick={onUndo}>Undo</Button>
        <Button onClick={onClear}>Clear</Button>
        <Button onClick={() => setLazyBrush(!lazyBrush)}>Toggle Lazy Brush</Button>
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
