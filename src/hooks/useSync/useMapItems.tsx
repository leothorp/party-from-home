import { useState, useCallback, useEffect } from 'react';
import useMap from './useMap';

export interface Items {
  [key: string]: any;
}

export default function useMapItems(name: string) {
  const [items, setItems] = useState({} as Items);

  const onAdded = useCallback(
    (args: any) => {
      setItems({
        ...items,
        [args.item.key]: args.item.value,
      });
    },
    [items]
  );

  const onRemoved = useCallback(
    (item: any) => {
      const newItems = { ...items };
      delete newItems[item.key];
      setItems(newItems);
    },
    [items]
  );

  const onUpdated = useCallback(
    (args: any) => {
      setItems({
        ...items,
        [args.item.key]: args.item.value,
      });
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
      const newItems = {} as Items;
      paginator.items.forEach((item: any) => {
        newItems[item.key] = item.value;
      });

      setItems(newItems);
    });
  }, [map]);

  return items;
}
