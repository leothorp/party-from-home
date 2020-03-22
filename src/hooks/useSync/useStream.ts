import { useState, useEffect, useCallback } from 'react';
import { useAppState } from '../../state';

interface Options {
  onMessage?: (item: { message: string; isLocal: string }) => void;
  onRemoved?: (item: any) => void;
}

export default function useStream(name: string, options?: Options) {
  const { syncClient } = useAppState();
  const [stream, setStream] = useState<any | null>(null);

  useEffect(() => {
    syncClient?.stream(name).then((d: any) => {
      setStream(d);
    });
  }, [syncClient, name]);

  useEffect(() => {
    if (options && stream) {
      if (options.onMessage) {
        stream.on('messagePublished', options.onMessage);
      }

      if (options.onRemoved) {
        stream.on('removed', options.onRemoved);
      }
    }

    return () => {
      if (options && stream) {
        if (options.onMessage) {
          stream.removeListener('messagePublished', options.onMessage);
        }

        if (options.onRemoved) {
          stream.removeListener('removed', options.onRemoved);
        }
      }
    };
  }, [stream, options]);

  const publish = useCallback(
    (data: any) => {
      return new Promise((resolve, reject) => {
        stream
          .publishMessage(data)
          .then((message: any) => {
            resolve(message);
          })
          .catch(reject);
      });
    },
    [stream]
  );

  return { stream, publish };
}
