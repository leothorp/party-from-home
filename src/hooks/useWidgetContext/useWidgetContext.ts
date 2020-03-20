import { useContext } from 'react';
import useSyncState from '../useSync/useSyncState';
import { RoomWidgetContext } from '../../components/RoomWidget/RoomWidgetProvider';

export default function useWidgetContext() {
  const context = useContext(RoomWidgetContext);
  if (!context) {
    throw new Error('useWidgetContext must be used within a RoomWidgetProvider');
  }

  const [state, setState] = useSyncState(context.documentId);

  return {state, setState};
}
