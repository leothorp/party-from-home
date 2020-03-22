import { useState, useEffect } from 'react';
import { useAppState } from '../../state';

interface Options {
  onUpdated?: (item: any) => void;
  onRemoved?: (item: any) => void;
}

export default function useDocument(name: string, options?: Options) {
  const { syncClient } = useAppState();
  const [document, setDocument] = useState<any | null>(null);

  useEffect(() => {
    syncClient?.document(name).then((d: any) => {
      setDocument(d);
    });
  }, [syncClient, name]);

  useEffect(() => {
    if (options && document) {
      if (options.onRemoved) {
        document.on('removed', options.onRemoved);
      }

      if (options.onUpdated) {
        document.on('updated', options.onUpdated);
      }
    }

    return () => {
      if (options && document) {
        if (options.onRemoved) {
          document.removeListener('removed', options.onRemoved);
        }

        if (options.onUpdated) {
          document.removeListener('updated', options.onUpdated);
        }
      }
    };
  }, [document, options]);

  return document;
}
