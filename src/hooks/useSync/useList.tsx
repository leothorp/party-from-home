import { useState, useEffect, useCallback } from 'react';
import { useAppState } from '../../state';

interface Options {
  onAdded?: (item: any) => void;
  onRemoved?: (item: any) => void;
  onUpdated?: (item: any) => void;
}

export default function useList(name: string, options?: Options) {
  const { syncClient } = useAppState();
  const [list, setList] = useState<any | null>(null);

  useEffect(() => {
    syncClient?.list(name).then((l: any) => {
      setList(l);
    });
  }, [syncClient, name]);

  useEffect(() => {
    if (options && list) {
      if (options.onAdded) {
        list.on('itemAdded', options.onAdded);
      }

      if (options.onRemoved) {
        list.on('itemRemoved', options.onRemoved);
      }

      if (options.onUpdated) {
        list.on('itemUpdated', options.onUpdated);
      }
    }

    return () => {
      if (options && list) {
        if (options.onAdded) {
          list.removeListener('itemAdded', options.onAdded);
        }

        if (options.onRemoved) {
          list.removeListener('itemRemoved', options.onRemoved);
        }

        if (options.onUpdated) {
          list.removeListener('itemUpdated', options.onUpdated);
        }
      }
    };
  }, [list, options]);

  const addItem = useCallback(
    (item: any) => {
      list.push(item).catch((e: any) => console.error(e));
    },
    [list]
  );

  return { list, addItem };
}
