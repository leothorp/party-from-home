import { useState, useEffect } from 'react';
import { useAppState } from '../../state';

interface Options {
  onAdded?: (item: any) => void;
  onRemoved?: (item: any) => void;
  onUpdated?: (item: any) => void;
}

export default function useMap(name: string, options?: Options) {
  const { syncClient } = useAppState();
  const [map, setMap] = useState<any | null>(null);

  useEffect(() => {
    syncClient?.map(name).then((m: any) => {
      setMap(m);
    });
  }, [syncClient, name]);

  useEffect(() => {
    if (options && map) {
      if (options.onAdded) {
        map.on('itemAdded', options.onAdded);
      }

      if (options.onRemoved) {
        map.on('itemRemoved', options.onRemoved);
      }

      if (options.onUpdated) {
        map.on('itemUpdated', options.onUpdated);
      }
    }

    return () => {
      if (options && map) {
        if (options.onAdded) {
          map.removeListener('itemAdded', options.onAdded);
        }

        if (options.onRemoved) {
          map.removeListener('itemRemoved', options.onRemoved);
        }

        if (options.onUpdated) {
          map.removeListener('itemUpdated', options.onUpdated);
        }
      }
    };
  }, [map, options]);

  return { map };
}
