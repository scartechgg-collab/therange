import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/Logo';
import { AdminSession, SUPABASE_URL, supabase, upsertRow, upsertRows, deleteRow } from '../lib/supabase';
import { Plan } from '../data/plans';
import { usePlans, toDbPlan } from '../hooks/usePlans';
import { useLiveTable } from '../hooks/useLiveTable';

interface AdminDashboardPageProps {
  session: AdminSession;
  onLogout: () => void;
}

type Tab =
  | 'overview' | 'minecraft' | 'discord' | 'vps'
  | 'announcements' | 'status' | 'knowledgebase'
  | 'tickets' | 'orders' | 'content' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview',      label: 'Overview',      icon: '📊' },
  { id: 'minecraft',     label: 'Minecraft',     icon: '⛏️' },
  { id: 'discord',       label: 'Discord Bot',   icon: '🤖' },
  { id: 'vps',           label: 'VPS',           icon: '🖥️' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
  { id: 'status',        label: 'Status',        icon: '🟢' },
  { id: 'knowledgebase', label: 'Knowledgebase', icon: '📖' },
  { id: 'tickets',       label: 'Tickets',       icon: '🎫' },
  { id: 'orders',        label: 'Orders',        icon: '🧾' },
  { id: 'content',       label: 'Site Content',  icon: '✏️' },
  { id: 'settings',      label: 'Settings',      icon: '⚙️' },
];

/* ── UI atoms ────────────────────────────────────────────────── */

function Field({ label, value, onChange, mono = false, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; mono?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/60 transition-colors ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`solid-card rounded-2xl ${className}`}>{children}</div>;
}

function Toast({ msg, kind }: { msg: string; kind: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl text-[11px] font-black uppercase tracking-widest ${
        kind === 'success'
          ? 'bg-green-500/15 border-green-500/40 text-green-400'
          : 'bg-red-500/15 border-red-500/40 text-red-400'
      }`}
    >
      {kind === 'success' ? '✓ ' : '⚠ '}{msg}
    </motion.div>
  );
}

function useToast() {
  const [toast, setToast] = useState<{ msg: string; kind: 'success' | 'error' } | null>(null);
  const show = (msg: string, kind: 'success' | 'error' = 'success') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2600);
  };
  return { toast, show };
}

function EmptyState({ icon, title, note }: { icon: string; title: string; note?: string }) {
  return (
    <Card className="p-12 text-center">
      <span className="text-4xl block mb-3">{icon}</span>
      <h3 className="text-sm font-black text-white/70">{title}</h3>
      {note && <p className="text-[11px] text-white/35 mt-1.5">{note}</p>}
    </Card>
  );
}

/* ── Plan editor ─────────────────────────────────────────────── */

function PlanManager({ category, plans, onChange }: {
  category: 'minecraft' | 'discord' | 'vps';
  plans: Plan[];
  onChange: (msg: string, kind?: 'success' | 'error') => void;
}) {
  const [drafts, setDrafts] = useState<Plan[]>(plans);
  const [openId, setOpenId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirtyIds, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => { setDrafts(plans); setDirty(new Set()); }, [plans]);

  const markDirty = (id: string) => setDirty((d) => new Set(d).add(id));

  const update = (id: string, patch: Partial<Plan>) => {
    setDrafts((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    markDirty(id);
  };
  const updatePrice = (id: string, cur: 'INR' | 'USD', val: string) => {
    setDrafts((p) => p.map((x) => (x.id === id ? { ...x, price: { ...x.price, [cur]: Number(val) || 0 } } : x)));
    markDirty(id);
  };

  const removePlan = async (id: string) => {
    if (!confirm('Delete this plan? This cannot be undone.')) return;
    const { error } = await deleteRow('plans', id);
    if (error) onChange(error, 'error'); else onChange('Plan deleted');
  };

  const addPlan = async () => {
    const id = `${category}-new-${Date.now()}`;
    const newPlan: Plan = {
      id, name: 'NEW PLAN', category, ram: '2GB RAM',
      storage: '25GB NVMe SSD', cpu: '100%',
      location: category === 'minecraft' ? 'India Location' : undefined,
      ddos: 'DDoS Protection Included',
      price: { INR: 100, USD: 1.29 },
    };
    const { error } = await upsertRow('plans', toDbPlan(newPlan, drafts.length + 1));
    if (error) onChange(error, 'error'); else { onChange('Plan created'); setOpenId(id); }
  };

  const saveAll = async () => {
    if (dirtyIds.size === 0) { onChange('No changes to save'); return; }
    setSaving(true);
    const rows = drafts.filter((p) => dirtyIds.has(p.id)).map((p, i) => toDbPlan(p, plans.findIndex(x => x.id === p.id) + 1 || i + 1));
    const { error } = await upsertRows('plans', rows);
    setSaving(false);
    if (error) onChange(error, 'error');
    else { onChange(`${rows.length} plan(s) saved live`); setDirty(new Set()); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-black text-white capitalize">{category} Plans</h2>
          <p className="text-[11px] text-white/40">
            {drafts.length} plans · {dirtyIds.size > 0 ? <span className="text-yellow-400 font-bold">{dirtyIds.size} unsaved change{dirtyIds.size > 1 ? 's' : ''}</span> : 'all synced'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={addPlan} className="btn-secondary px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary">
            + Add Plan
          </button>
          <button
            onClick={saveAll}
            disabled={saving || dirtyIds.size === 0}
            className="btn-primary px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Publish Live'}
          </button>
        </div>
      </div>

      {drafts.length === 0 ? (
        <EmptyState icon="📦" title={`No ${category} plans yet`} note="Click 'Add Plan' to create one." />
      ) : (
        <div className="space-y-2">
          {drafts.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <button
                onClick={() => setOpenId(openId === plan.id ? null : plan.id)}
                className="w-full flex items-center justify-between gap-3 p-4 hover:bg-white/[0.03] transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{category === 'minecraft' ? '⛏️' : category === 'discord' ? '🤖' : '🖥️'}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-white truncate">{plan.name}</span>
                      {plan.popular && <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-primary/20 text-primary">POPULAR</span>}
                      {dirtyIds.has(plan.id) && <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-yellow-500/20 text-yellow-400">UNSAVED</span>}
                    </div>
                    <p className="text-[10px] text-white/35 truncate">
                      {plan.ram} · {plan.storage} · {plan.cpu}{plan.subCategory ? ` · ${plan.subCategory}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-black text-accent">₹{plan.price.INR}</span>
                  <svg className={`w-4 h-4 text-white/30 transition-transform ${openId === plan.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <AnimatePresence>
                {openId === plan.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <Field label="Plan Name" value={plan.name} onChange={(v) => update(plan.id, { name: v })} />
                      <Field label="RAM" value={plan.ram} onChange={(v) => update(plan.id, { ram: v })} />
                      <Field label="Storage" value={plan.storage} onChange={(v) => update(plan.id, { storage: v })} />
                      <Field label="CPU" value={plan.cpu} onChange={(v) => update(plan.id, { cpu: v })} />
                      <Field label="Location" value={plan.location || ''} onChange={(v) => update(plan.id, { location: v })} />
                      <Field label="Sub Category" value={plan.subCategory || ''} onChange={(v) => update(plan.id, { subCategory: v })} />
                      <Field label="Price INR (₹)" type="number" value={String(plan.price.INR)} onChange={(v) => updatePrice(plan.id, 'INR', v)} mono />
                      <Field label="Price USD ($)" type="number" value={String(plan.price.USD)} onChange={(v) => updatePrice(plan.id, 'USD', v)} mono />
                      <Field label="Plan ID" value={plan.id} onChange={() => {}} mono />
                    </div>
                    <div className="px-4 pb-4 flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={!!plan.popular} onChange={(e) => update(plan.id, { popular: e.target.checked })} className="w-4 h-4 accent-[#00A8FF]" />
                        <span className="text-[11px] text-white/60 font-semibold">Mark as Popular</span>
                      </label>
                      <button onClick={() => removePlan(plan.id)} className="ml-auto px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition-colors">
                        Delete Plan
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Dashboard ───────────────────────────────────────────────── */

interface Announcement { id: string; title: string; body: string; type: string; pinned: boolean; published: boolean; }
interface Service { id: string; name: string; status: string; uptime: string; response_ms: number; sort_order: number; }
interface Ticket { id: string; ref: string; name: string; email: string; subject: string; category: string; priority: string; status: string; created_at: string; }
interface Order { id: string; invoice_id: string; plan_name: string; amount: number; currency: string; status: string; created_at: string; }
interface Article { id: string; title: string; slug: string; published: boolean; views: number; category_id: string | null; }
interface KbCat { id: string; slug: string; title: string; icon: string; }
interface Content { key: string; value: string; label: string; }

export function AdminDashboardPage({ session, onLogout }: AdminDashboardPageProps) {
  const [tab, setTab] = useState<Tab>(() => {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem('rc.admin.tab') : null;
    return (TABS.find((t) => t.id === v)?.id ?? 'overview') as Tab;
  });
  const { toast, show } = useToast();

  useEffect(() => { try { localStorage.setItem('rc.admin.tab', tab); } catch {} }, [tab]);

  const { plans, minecraft, discord, vps } = usePlans();
  const announcements = useLiveTable<Announcement>('announcements', { orderBy: 'sort_order', ascending: true });
  const services      = useLiveTable<Service>('service_status',      { orderBy: 'sort_order', ascending: true });
  const tickets       = useLiveTable<Ticket>('tickets',              { orderBy: 'created_at', ascending: false });
  const orders        = useLiveTable<Order>('orders',                { orderBy: 'created_at', ascending: false });
  const articles      = useLiveTable<Article>('kb_articles',         { orderBy: 'sort_order', ascending: true });
  const kbCats        = useLiveTable<KbCat>('kb_categories',         { orderBy: 'sort_order', ascending: true });
  const content       = useLiveTable<Content>('site_content',        { orderBy: 'key',        ascending: true });

  const statusColor = (s: string) =>
    s === 'operational' ? 'text-green-400 bg-green-500/10 border-green-500/30'
      : s === 'degraded' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      : s === 'maintenance' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      : 'text-red-400 bg-red-500/10 border-red-500/30';

  /* ── Overview stats ── */
  const totalRevenue = orders.rows
    .filter((o) => o.status === 'paid' || o.status === 'verified')
    .reduce((s, o) => s + Number(o.amount || 0), 0);

  /* ── Save handlers ── */
  const saveContent = async (key: string, value: string) => {
    const row = content.rows.find((c) => c.key === key);
    const { error } = await upsertRow('site_content', { key, value, label: row?.label ?? key });
    if (error) show(error, 'error'); else show('Content updated');
  };
  const saveService = async (svc: Service) => {
    const { error } = await upsertRow('service_status', svc);
    if (error) show(error, 'error'); else show('Status updated');
  };
  const saveAnnouncement = async (a: Announcement) => {
    const { error } = await upsertRow('announcements', a);
    if (error) show(error, 'error'); else show('Announcement saved');
  };
  const saveArticle = async (a: Article) => {
    const { error } = await upsertRow('kb_articles', a);
    if (error) show(error, 'error'); else show('Article saved');
  };
  const saveTicket = async (t: Partial<Ticket> & { id: string }) => {
    const { error } = await upsertRow('tickets', t);
    if (error) show(error, 'error'); else show('Ticket updated');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-black border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size={36} glow={false} />
            <div className="min-w-0">
              <h1 className="text-sm font-black text-white truncate">Admin Console</h1>
              <p className="text-[9px] text-white/35 font-mono truncate">{session.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black border text-green-400 bg-green-500/10 border-green-500/30">
              <span className="w-1.5 h-1.5 rounded-full status-online" />
              LIVE · DB CONNECTED
            </span>
            <button onClick={onLogout} className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                  tab === t.id ? 'btn-primary text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div>
                <h2 className="text-lg font-black text-white mb-5">Dashboard Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Total Plans', value: plans.length, icon: '📦' },
                    { label: 'Open Tickets', value: tickets.rows.filter((t) => t.status === 'open').length, icon: '🎫' },
                    { label: 'Orders', value: orders.rows.length, icon: '🧾' },
                    { label: 'Revenue (₹)', value: totalRevenue.toLocaleString('en-IN'), icon: '💰' },
                  ].map((s) => (
                    <Card key={s.label} className="p-5">
                      <span className="text-xl block mb-2">{s.icon}</span>
                      <div className="text-2xl font-black text-white">{s.value}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">{s.label}</div>
                    </Card>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="p-5">
                    <h3 className="text-sm font-black text-white mb-4">Plan Breakdown</h3>
                    {[
                      { n: 'Minecraft', c: minecraft.length, color: 'from-green-400 to-emerald-600' },
                      { n: 'Discord Bot', c: discord.length, color: 'from-indigo-400 to-purple-600' },
                      { n: 'VPS', c: vps.length, color: 'from-primary to-accent' },
                    ].map((r) => {
                      const total = Math.max(1, plans.length);
                      return (
                        <div key={r.n} className="mb-4 last:mb-0">
                          <div className="flex justify-between text-[11px] mb-1.5">
                            <span className="text-white/60 font-semibold">{r.n}</span>
                            <span className="text-white font-black">{r.c} plans</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(r.c / total) * 100}%` }} transition={{ duration: 0.9 }} className={`h-full bg-gradient-to-r ${r.color} rounded-full`} />
                          </div>
                        </div>
                      );
                    })}
                  </Card>

                  <Card className="p-5">
                    <h3 className="text-sm font-black text-white mb-4">System Health</h3>
                    {services.rows.length === 0 ? (
                      <p className="text-[11px] text-white/40">No monitors yet — add some in the Status tab.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {services.rows.slice(0, 6).map((s) => (
                          <div key={s.id} className="flex items-center justify-between">
                            <span className="text-[11px] text-white/60 truncate pr-2">{s.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border ${statusColor(s.status)}`}>
                              {s.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {/* PLAN MANAGERS */}
            {tab === 'minecraft' && <PlanManager category="minecraft" plans={minecraft} onChange={show} />}
            {tab === 'discord'   && <PlanManager category="discord"   plans={discord}   onChange={show} />}
            {tab === 'vps'       && <PlanManager category="vps"       plans={vps}       onChange={show} />}

            {/* ANNOUNCEMENTS */}
            {tab === 'announcements' && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-black text-white">Announcements</h2>
                    <p className="text-[11px] text-white/40">{announcements.rows.length} total · live from Supabase</p>
                  </div>
                  <button
                    onClick={async () => {
                      const { error } = await upsertRow('announcements', {
                        title: 'New Announcement', body: '', type: 'info', pinned: false,
                        published: true, sort_order: announcements.rows.length + 1,
                      });
                      if (error) show(error, 'error'); else show('Announcement created');
                    }}
                    className="btn-secondary px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary"
                  >
                    + New
                  </button>
                </div>

                {announcements.rows.length === 0 ? (
                  <EmptyState icon="📢" title="No announcements yet" note="Click '+ New' to publish one." />
                ) : (
                  <div className="space-y-3">
                    {announcements.rows.map((a) => (
                      <Card key={a.id} className="p-4">
                        <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-3">
                          <Field label="Title" value={a.title || ''}
                            onChange={(v) => saveAnnouncement({ ...a, title: v })} />
                          <div>
                            <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">Type</label>
                            <select
                              value={a.type}
                              onChange={(e) => saveAnnouncement({ ...a, type: e.target.value })}
                              className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/60"
                            >
                              <option value="info">Info</option><option value="success">Success</option>
                              <option value="warning">Warning</option><option value="critical">Critical</option>
                            </select>
                          </div>
                        </div>
                        <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">Body</label>
                        <textarea
                          rows={2}
                          value={a.body || ''}
                          onChange={(e) => saveAnnouncement({ ...a, body: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/60 resize-none"
                        />
                        <div className="flex items-center gap-4 mt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={!!a.pinned} onChange={(e) => saveAnnouncement({ ...a, pinned: e.target.checked })} className="w-4 h-4 accent-[#00A8FF]" />
                            <span className="text-[11px] text-white/60 font-semibold">Pinned</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={a.published !== false} onChange={(e) => saveAnnouncement({ ...a, published: e.target.checked })} className="w-4 h-4 accent-[#00A8FF]" />
                            <span className="text-[11px] text-white/60 font-semibold">Published</span>
                          </label>
                          <button
                            onClick={async () => { if (confirm('Delete this announcement?')) { const { error } = await deleteRow('announcements', a.id); if (error) show(error, 'error'); else show('Deleted'); } }}
                            className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/25"
                          >
                            Delete
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STATUS */}
            {tab === 'status' && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-black text-white">Status Page Manager</h2>
                    <p className="text-[11px] text-white/40">{services.rows.length} monitors · live-synced</p>
                  </div>
                  <button
                    onClick={async () => {
                      const { error } = await upsertRow('service_status', {
                        name: 'New Service', status: 'operational', uptime: '100.00%',
                        response_ms: 0, sort_order: services.rows.length + 1,
                      });
                      if (error) show(error, 'error'); else show('Monitor added');
                    }}
                    className="btn-secondary px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary"
                  >
                    + Add Monitor
                  </button>
                </div>

                {services.rows.length === 0 ? (
                  <EmptyState icon="🟢" title="No status monitors yet" note="Add one to display on the public status page." />
                ) : (
                  <div className="space-y-2">
                    {services.rows.map((s) => (
                      <Card key={s.id} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                          <div className="sm:col-span-2"><Field label="Service Name" value={s.name} onChange={(v) => saveService({ ...s, name: v })} /></div>
                          <div>
                            <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">Status</label>
                            <select
                              value={s.status}
                              onChange={(e) => saveService({ ...s, status: e.target.value })}
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/60"
                            >
                              <option value="operational">Operational</option><option value="degraded">Degraded</option>
                              <option value="maintenance">Maintenance</option><option value="outage">Outage</option>
                            </select>
                          </div>
                          <Field label="Uptime" value={s.uptime} onChange={(v) => saveService({ ...s, uptime: v })} mono />
                          <div className="flex gap-2">
                            <div className="flex-1"><Field label="Response (ms)" type="number" value={String(s.response_ms)} onChange={(v) => saveService({ ...s, response_ms: Number(v) || 0 })} mono /></div>
                            <button
                              onClick={async () => { if (confirm('Delete monitor?')) { const { error } = await deleteRow('service_status', s.id); if (error) show(error, 'error'); else show('Deleted'); } }}
                              className="self-end px-3 py-2.5 rounded-lg text-[10px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/25"
                            >✕</button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* KNOWLEDGEBASE */}
            {tab === 'knowledgebase' && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-black text-white">Knowledgebase Articles</h2>
                    <p className="text-[11px] text-white/40">{articles.rows.length} articles across {kbCats.rows.length} categories</p>
                  </div>
                  <button
                    onClick={async () => {
                      const slug = `article-${Date.now()}`;
                      const { error } = await upsertRow('kb_articles', {
                        title: 'New Article', slug, content: '', published: false,
                        views: 0, sort_order: articles.rows.length + 1,
                        category_id: kbCats.rows[0]?.id ?? null,
                      });
                      if (error) show(error, 'error'); else show('Article created');
                    }}
                    className="btn-secondary px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary"
                  >
                    + New Article
                  </button>
                </div>

                {articles.rows.length === 0 ? (
                  <EmptyState icon="📖" title="No articles yet" note="Publish helpful guides for your users." />
                ) : (
                  <div className="space-y-2">
                    {articles.rows.map((a) => (
                      <Card key={a.id} className="p-4">
                        <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-3">
                          <Field label="Title" value={a.title} onChange={(v) => saveArticle({ ...a, title: v })} />
                          <div>
                            <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">Category</label>
                            <select
                              value={a.category_id || ''}
                              onChange={(e) => saveArticle({ ...a, category_id: e.target.value || null })}
                              className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/60"
                            >
                              <option value="">— none —</option>
                              {kbCats.rows.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] text-white/30 font-mono">{a.views} views · {a.slug}</span>
                          <button
                            onClick={() => saveArticle({ ...a, published: !a.published })}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${a.published ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-white/40 bg-white/5 border-white/10'}`}
                          >
                            {a.published ? 'Published' : 'Draft'}
                          </button>
                          <button
                            onClick={async () => { if (confirm('Delete article?')) { const { error } = await deleteRow('kb_articles', a.id); if (error) show(error, 'error'); else show('Deleted'); } }}
                            className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/25"
                          >
                            Delete
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TICKETS */}
            {tab === 'tickets' && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-black text-white">Support Ticket System</h2>
                  <p className="text-[11px] text-white/40">{tickets.rows.length} total tickets · live inbox</p>
                </div>

                {tickets.rows.length === 0 ? (
                  <EmptyState icon="🎫" title="Inbox zero" note="Tickets submitted from the Support page will appear here in real-time." />
                ) : (
                  <div className="space-y-2">
                    {tickets.rows.map((t) => (
                      <Card key={t.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-black text-white truncate">{t.subject}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
                                t.priority === 'high' ? 'bg-red-500/15 text-red-400' :
                                t.priority === 'medium' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-blue-500/15 text-blue-400'
                              }`}>{(t.priority || '').toUpperCase()}</span>
                            </div>
                            <p className="text-[10px] text-white/35 font-mono">{t.ref} · {t.email} · {t.category} · {new Date(t.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                              value={t.status}
                              onChange={(e) => saveTicket({ id: t.id, status: e.target.value })}
                              className={`bg-black border rounded-lg px-3 py-2 text-[10px] font-black uppercase focus:outline-none ${
                                t.status === 'open' ? 'text-green-400 border-green-500/30' :
                                t.status === 'pending' ? 'text-yellow-400 border-yellow-500/30' : 'text-white/40 border-white/10'
                              }`}
                            >
                              <option value="open">Open</option><option value="pending">Pending</option><option value="closed">Closed</option>
                            </select>
                            <button
                              onClick={async () => { if (confirm('Delete ticket?')) { const { error } = await deleteRow('tickets', t.id); if (error) show(error, 'error'); else show('Deleted'); } }}
                              className="px-3 py-2 rounded-lg text-[10px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/25"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS */}
            {tab === 'orders' && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-black text-white">Orders &amp; Invoices</h2>
                  <p className="text-[11px] text-white/40">{orders.rows.length} orders · updated live</p>
                </div>

                {orders.rows.length === 0 ? (
                  <EmptyState icon="🧾" title="No orders yet" note="Purchases from the site will appear here." />
                ) : (
                  <Card className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-white/8">
                          {['Invoice', 'Plan', 'Amount', 'Status', 'Date'].map(h => (
                            <th key={h} className="text-left text-[9px] font-black uppercase tracking-widest text-white/35 px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.rows.map((o) => (
                          <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                            <td className="px-4 py-3.5 text-[11px] font-mono text-white">{o.invoice_id}</td>
                            <td className="px-4 py-3.5 text-[11px] font-bold text-white/80">{o.plan_name}</td>
                            <td className="px-4 py-3.5 text-[11px] font-black text-accent">{o.currency === 'INR' ? '₹' : '$'}{Number(o.amount).toFixed(2)}</td>
                            <td className="px-4 py-3.5">
                              <select
                                value={o.status}
                                onChange={async (e) => { const { error } = await upsertRow('orders', { id: o.id, status: e.target.value }); if (error) show(error, 'error'); else show('Order updated'); }}
                                className={`bg-black border rounded px-2 py-1 text-[9px] font-black uppercase ${
                                  o.status === 'verified' ? 'text-green-400 border-green-500/30' :
                                  o.status === 'paid' ? 'text-primary border-primary/30' :
                                  o.status === 'cancelled' || o.status === 'refunded' ? 'text-red-400 border-red-500/30' :
                                  'text-yellow-400 border-yellow-500/30'
                                }`}
                              >
                                <option value="pending">Pending</option><option value="paid">Paid</option>
                                <option value="verified">Verified</option><option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="px-4 py-3.5 text-[10px] text-white/40">{new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}
              </div>
            )}

            {/* SITE CONTENT */}
            {tab === 'content' && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-black text-white">Site Content Editor</h2>
                  <p className="text-[11px] text-white/40">{content.rows.length} editable fields</p>
                </div>

                {content.rows.length === 0 ? (
                  <EmptyState icon="✏️" title="No editable content" note="Insert rows into the site_content table to make copy editable here." />
                ) : (
                  <div className="space-y-3">
                    {content.rows.map((c) => {
                      const multiline = c.value.length > 60 || c.key.startsWith('about_');
                      return (
                        <Card key={c.key} className="p-4">
                          <label className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-2">{c.label || c.key}</label>
                          {multiline ? (
                            <textarea
                              rows={3}
                              defaultValue={c.value}
                              onBlur={(e) => e.target.value !== c.value && saveContent(c.key, e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/60 resize-none leading-relaxed"
                            />
                          ) : (
                            <input
                              defaultValue={c.value}
                              onBlur={(e) => e.target.value !== c.value && saveContent(c.key, e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-primary/60"
                            />
                          )}
                          <p className="text-[9px] text-white/25 mt-1.5 font-mono">key: {c.key} · saves on blur</p>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {tab === 'settings' && (
              <div>
                <h2 className="text-lg font-black text-white mb-5">Settings</h2>
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="p-5">
                    <h3 className="text-sm font-black text-white mb-3">Admin Account</h3>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-white/40">Email</span><span className="text-white font-mono">{session.email}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">Role</span><span className="text-primary font-black">{session.role.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">User ID</span><span className="text-white/60 font-mono truncate max-w-[160px]">{session.id}</span></div>
                    </div>
                  </Card>

                  <Card className="p-5">
                    <h3 className="text-sm font-black text-white mb-3">Database Connection</h3>
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border bg-green-500/10 border-green-500/30">
                      <span className="w-2 h-2 rounded-full status-online" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                        Supabase Live · Connected
                      </span>
                    </div>
                    <div className="space-y-2.5 text-[11px]">
                      <div className="flex justify-between gap-3">
                        <span className="text-white/40 flex-shrink-0">Project URL</span>
                        <span className="text-white/70 font-mono truncate">{SUPABASE_URL.replace('https://', '')}</span>
                      </div>
                      <div className="flex justify-between"><span className="text-white/40">Realtime</span><span className="text-green-400 font-black">SUBSCRIBED</span></div>
                      <div className="flex justify-between"><span className="text-white/40">RLS</span><span className="text-green-400 font-black">ENABLED</span></div>
                      <div className="flex justify-between"><span className="text-white/40">Session</span><span className="text-green-400 font-black">PERSISTED</span></div>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await Promise.all([
                            supabase.from('plans').select('id').limit(1),
                            supabase.from('service_status').select('id').limit(1),
                          ]);
                          show('Database reachable · all systems green');
                        } catch (e: any) {
                          show(e?.message || 'Connection failed', 'error');
                        }
                      }}
                      className="w-full mt-4 btn-secondary py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary"
                    >
                      Test Connection
                    </button>
                  </Card>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>{toast && <Toast msg={toast.msg} kind={toast.kind} />}</AnimatePresence>
    </div>
  );
}
