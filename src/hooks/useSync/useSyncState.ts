import { useCallback, useState, useEffect } from 'react';
import useDocument from './useDocument';

export interface Options {
    onReady?: () => void;
}

export default function useSyncState(name: string, opts?: Options) {
    const [data, setData] = useState<any | null>(null);

    const onUpdated = useCallback((item: any) => {
        setData(item.value);
    }, [setData]);

    const document = useDocument(name, {
        onUpdated,
    });

    useEffect(() => {
        if (document && data === null) {
            setData(document.value);
            if (opts?.onReady) {
                opts.onReady();
            }
        }
    }, [data, document, opts]);

    const setValue = useCallback((val: any) => {
        document.set(val).then(() => {
            console.log('document value set');
        }).catch((e: any) => console.error(e));
    }, [document]);

    return [data, setValue]
};