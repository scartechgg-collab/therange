import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Plan, minecraftPlans as fallbackMc, discordPlans as fallbackDc, vpsPlans as fallbackVps } from '../data/plans';

interface DbPlan {
  id: string;
  name: string;
  category: 'minecraft' | 'discord' | 'vps';
  sub_category: string | null;
  ram: string;
  storage: string;
  cpu: string;
  location: string | null;
  ddos: string;
  price_inr: number;
  price_usd: number;
  popular: boolean;
  active: boolean;
  sort_order: number;
}

function toPlan(r: DbPlan): Plan {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    subCategory: r.sub_category ?? undefined,
    ram: r.ram,
    storage: r.storage,
    cpu: r.cpu,
    location: r.location ?? undefined,
    ddos: r.ddos,
    price: { INR: Number(r.price_inr) || 0, USD: Number(r.price_usd) || 0 },
    popular: r.popular,
  };
}

export function toDbPlan(p: Plan, sort_order = 0): DbPlan {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    sub_category: p.subCategory ?? null,
    ram: p.ram,
    storage: p.storage,
    cpu: p.cpu,
    location: p.location ?? null,
    ddos: p.ddos || 'DDoS Protection Included',
    price_inr: p.price.INR,
    price_usd: p.price.USD,
    popular: !!p.popular,
    active: true,
    sort_order,
  };
}

const FALLBACK: Plan[] = [...fallbackMc, ...fallbackDc, ...fallbackVps];

/**
 * Reads plans from Supabase and keeps them live-updated via realtime.
 * Falls back to bundled data ONLY on first paint before the network resolves.
 */
export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else if (data) {
      setPlans((data as DbPlan[]).map(toPlan));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel('rc-plans-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  return {
    plans,
    minecraft: plans.filter((p) => p.category === 'minecraft'),
    discord:   plans.filter((p) => p.category === 'discord'),
    vps:       plans.filter((p) => p.category === 'vps'),
    loading,
    error,
    reload: load,
  };
}
