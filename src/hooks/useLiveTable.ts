import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Options {
  orderBy?: string;
  ascending?: boolean;
  filter?: { column: string; value: any };
}

/** Reads a table and subscribes to realtime changes. */
export function useLiveTable<T = any>(table: string, opts: Options = {}) {
  const { orderBy = 'created_at', ascending = false, filter } = opts;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    let q = supabase.from(table).select('*').order(orderBy, { ascending });
    if (filter) q = q.eq(filter.column, filter.value);
    const { data, error } = await q;
    if (error) setError(error.message);
    else { setRows((data as T[]) ?? []); setError(null); }
    setLoading(false);
  }, [table, orderBy, ascending, filter?.column, filter?.value]);

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`rc-live-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, table]);

  return { rows, setRows, loading, error, reload: load };
}
