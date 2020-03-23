import { useState, useEffect, useCallback } from 'react';
import { useAppState } from '../../state';

interface Options {
  onUpdated?: (item: any) => void;
  onRemoved?: (item: any) => void;
}

export default function useDocument(name: string, options?: Options) {
  const { syncClient } = useAppState();
  const [retries, setRetries] = useState(10);
  const [document, setDocument] = useState<any | null>(null);

  const getDocument = useCallback(() => {
    syncClient
      ?.document(name)
      .then((d: any) => {
        setDocument(d);
      })
      .catch(e => {
        console.log(e);
        if (retries > 0) {
          console.log('retrying document');
          setRetries(retries - 1);
        }
      });
  }, [name, retries, syncClient]);

  useEffect(() => {
    if (retries === 10) {
      getDocument();
    } else {
      setTimeout(getDocument, 1000);
    }
  }, [getDocument, retries]);

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
