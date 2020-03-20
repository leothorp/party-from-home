import { useState, useEffect } from 'react';
import { useAppState } from '../../state';
import SyncClient from 'twilio-sync';

interface Options {
  onUpdated?: (item: any) => void;
  onRemoved?: (item: any) => void;
}

export default function useDocument(name: string, options?: Options) {
  const { getSyncToken } = useAppState();
  const [client, setClient] = useState<any | null>(null);
  const [document, setDocument] = useState<any | null>(null);

  useEffect(() => {
    getSyncToken().then(token => {
      const syncClient = new SyncClient(token);

      setClient(syncClient);
    });
  }, [getSyncToken]);

  // useEffect(() => {
  //   client?.on('tokenAboutToExpire', () => {
  //     getSyncToken().then(token => {
  //       client.updateToken(token);
  //       setClient(client);
  //     });
  //   });
  // }, [client, getSyncToken]);

  useEffect(() => {
    client?.document(name).then((d: any) => {
      setDocument(d);
    });
  }, [client, name]);

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
