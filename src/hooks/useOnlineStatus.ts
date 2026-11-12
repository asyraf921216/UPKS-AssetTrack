import { useEffect, useState } from 'react';
import { borrowAssetAction, returnAssetAction } from '../services/storage';

export interface OfflineSyncItem {
  id: string;
  type: 'borrow' | 'return';
  assetId: string;
  payload: any;
  timestamp: string;
}

const OFFLINE_QUEUE_KEY = 'upks_offline_sync_queue_v1';

export function getOfflineQueue(): OfflineSyncItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineSyncItem[]) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function addOfflineSyncItem(item: Omit<OfflineSyncItem, 'id' | 'timestamp'>) {
  const queue = getOfflineQueue();
  queue.push({
    ...item,
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString()
  });
  saveOfflineQueue(queue);
}

export function flushOfflineQueue(): { count: number; failed: number } {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { count: 0, failed: 0 };

  let success = 0;
  let failed = 0;

  queue.forEach(item => {
    try {
      if (item.type === 'borrow') {
        const { borrowerName, toLocation, borrowedDate, expectedReturnDate, notes } = item.payload;
        borrowAssetAction(item.assetId, borrowerName, toLocation, borrowedDate, expectedReturnDate, notes);
        success++;
      } else if (item.type === 'return') {
        const { returnedDate } = item.payload;
        returnAssetAction(item.assetId, returnedDate);
        success++;
      }
    } catch {
      failed++;
    }
  });

  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  return { count: success, failed };
}

export function useOnlineStatus(onSyncComplete?: (count: number) => void) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingSyncCount, setPendingSyncCount] = useState(getOfflineQueue().length);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const res = flushOfflineQueue();
      setPendingSyncCount(0);
      if (res.count > 0 && onSyncComplete) {
        onSyncComplete(res.count);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onSyncComplete]);

  return {
    isOnline,
    pendingSyncCount
  };
}
