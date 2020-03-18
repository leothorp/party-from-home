import { useEffect } from 'react';

const useMountEffect = (fun: any) => useEffect(fun, []);

export default useMountEffect;
