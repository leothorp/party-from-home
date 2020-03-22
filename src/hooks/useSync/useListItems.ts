import { useState, useCallback, useEffect } from 'react';
import useList from './useList';

export default function useListItems(name: string) {
  const [items, setItems] = useState<any[]>([]);

  const onAdded = useCallback(
    (args: any) => {
      setItems([...items, args.item.value]);
    },
    [items]
  );

  const onRemoved = useCallback(
    (item: any) => {
      const newItems = [...items];
      setItems(newItems.splice(item.index, 1));
    },
    [items]
  );

  const onUpdated = useCallback(
    (args: any) => {
      const newItems = [...items];
      newItems[args.item.index] = args.item.value;
      setItems(newItems);
    },
    [items]
  );

  const { list } = useList(name, {
    onAdded,
    onRemoved,
    onUpdated,
  });

  useEffect(() => {
    list?.getItems().then((paginator: any) => {
      const newItems: any[] = [];
      paginator.items.forEach((item: any) => {
        newItems[item.key] = item.value;
      });

      setItems(newItems);
    });
  }, [list]);

  return items;
}
