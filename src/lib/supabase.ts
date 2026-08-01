import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Range Cloud Hosting — Supabase (LIVE)
 * Values can be overridden via .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 */
const ENV = (import.meta as any).env ?? {};

export const SUPABASE_URL: string =
  ENV.VITE_SUPABASE_URL || 'https://qvyurucgrqglnhpixwfq.supabase.co';

export const SUPABASE_ANON_KEY: string =
  ENV.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eXVydWNncnFnbG5ocGl4d2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTA3NzYsImV4cCI6MjEwMDcyNjc3Nn0.yHY-aUl6jvxH1VKMl9UZ7960uAxhqugfhs_ikuzabBU';

export const SUPABASE_PUBLISHABLE_KEY: string =
  ENV.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Sxv6kkEcZ6HsEE35hqfsrQ_fXNLyd43';

export const ADMIN_EMAIL = 'root@rangecloud.in';

/** Live Supabase client — always configured. */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'rangecloud.admin.auth',
  },
});

export interface AdminSession {
  email: string;
  id: string;
  role: string;
}

/* ── AUTHENTICATION ──────────────────────────────────────────────── */

/** Sign in to the admin console. Restricted to ADMIN_EMAIL. */
export async function adminSignIn(
  email: string,
  password: string
): Promise<{ session: AdminSession | null; error: string | null }> {
  const normalized = email.trim().toLowerCase();

  if (normalized !== ADMIN_EMAIL) {
    return { session: null, error: 'Access denied. This account is not authorised for the admin console.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (error) {
    const msg = /invalid login/i.test(error.message)
      ? 'Invalid email or password. Please try again.'
      : /email not confirmed/i.test(error.message)
        ? 'Email not confirmed. Enable "Auto Confirm" for this user in Supabase.'
        : error.message;
    return { session: null, error: msg };
  }

  if (!data.user) return { session: null, error: 'Authentication failed. No user returned.' };

  return {
    session: {
      email: data.user.email ?? normalized,
      id: data.user.id,
      role: 'superadmin',
    },
    error: null,
  };
}

export async function adminSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Restore an existing admin session (page refresh). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user?.email) return null;
  if (user.email.toLowerCase() !== ADMIN_EMAIL) return null;
  return { email: user.email, id: user.id, role: 'superadmin' };
}

/* ── DATA HELPERS ────────────────────────────────────────────────── */

export async function fetchTable<T>(
  table: string,
  fallback: T[] = [],
  orderBy = 'sort_order'
): Promise<{ data: T[]; error: string | null }> {
  const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: true });
  if (error) return { data: fallback, error: error.message };
  return { data: (data as T[]) ?? fallback, error: null };
}

export async function upsertRow(table: string, row: Record<string, any>) {
  const { error } = await supabase.from(table).upsert(row);
  return { error: error?.message ?? null };
}

export async function upsertRows(table: string, rows: Record<string, any>[]) {
  const { error } = await supabase.from(table).upsert(rows);
  return { error: error?.message ?? null };
}

export async function deleteRow(table: string, id: string | number) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  return { error: error?.message ?? null };
}
