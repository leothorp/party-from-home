import { useCallback } from 'react';
import useDocument from './useDocument';

export default function useSyncState(name: string) {
    const document = useDocument(name);

    const setValue = useCallback((val: any) => {
        document.set(val);
    }, [document]);

    return [document.data, setValue]
};