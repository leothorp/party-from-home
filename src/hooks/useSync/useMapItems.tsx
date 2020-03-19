import { useState, useCallback, useEffect } from 'react';
import useMap from './useMap';

export interface Items {
  [key: string]: any;
}

export default function useMapItems(name: string) {
  const [items, setItems] = useState({} as Items);

  const onAdded = useCallback(
    (args: any) => {
      items[args.item.key] = args.item.value;
    },
    [items]
  );

  const onRemoved = useCallback(
    (item: any) => {
      items[item.key] = null;
    },
    [items]
  );

  const onUpdated = useCallback(
    (args: any) => {
      items[args.item.key] = args.item.value;
    },
    [items]
  );

  const { map } = useMap(name, {
    onAdded,
    onRemoved,
    onUpdated,
  });

  useEffect(() => {
    map?.getItems().then((paginator: any) => {
      setItems(paginator.items);
    });
  }, [map]);

  return items;
}
