import { useState, useEffect } from 'react';
import { useAppState } from '../../state';
import SyncClient from 'twilio-sync';

interface Options {
  onAdded?: (item: any) => void;
  onRemoved?: (item: any) => void;
  onUpdated?: (item: any) => void;
}

export default function useMap(name: string, options?: Options) {
  const { getSyncToken } = useAppState();
  const [client, setClient] = useState<any | null>(null);
  const [map, setMap] = useState<any | null>(null);

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
    client?.map(name).then((m: any) => {
      setMap(m);
    });
  }, [client, name]);

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
