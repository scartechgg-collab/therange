import { useMemo } from 'react';
import { useLiveTable } from './useLiveTable';

interface Content { key: string; value: string; label: string; }

/** Read all site_content rows keyed by their `key` field. */
export function useSiteContent() {
  const { rows, loading } = useLiveTable<Content>('site_content', { orderBy: 'key', ascending: true });
  const map = useMemo(() => {
    const m = new Map<string, string>();
    rows.forEach((r) => m.set(r.key, r.value));
    return m;
  }, [rows]);
  return {
    get: (key: string, fallback = '') => map.get(key) ?? fallback,
    loading,
  };
}
