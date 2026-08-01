import { motion } from 'framer-motion';
import { useLiveTable } from '../hooks/useLiveTable';

interface ClientAreaPageProps {
  services: any[];
}

interface Order  { id: string; invoice_id: string; plan_name: string; amount: number; currency: string; status: string; created_at: string; }
interface Ticket { id: string; ref: string; subject: string; priority: string; status: string; created_at: string; }

export function ClientAreaPage({ services }: ClientAreaPageProps) {
  const orders  = useLiveTable<Order>('orders',   { orderBy: 'created_at', ascending: false });
  const tickets = useLiveTable<Ticket>('tickets', { orderBy: 'created_at', ascending: false });

  const recentOrders  = orders.rows.slice(0, 5);
  const recentTickets = tickets.rows.slice(0, 5);

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center md:text-left"
          >
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              SECURE AREA
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mt-4 mb-2 tracking-tight">
              Control <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Panel</span>
            </h1>
            <p className="text-white/50 text-sm">Manage your active deployments and orders.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Services', value: services.length.toString(), icon: '🖥️' },
              { label: 'Open Tickets', value: tickets.rows.filter((t) => t.status === 'open').length.toString(), icon: '🎫' },
              { label: 'Total Orders', value: orders.rows.length.toString(), icon: '🧾' },
              { label: 'Currency', value: 'INR / USD', icon: '💳' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="solid-card rounded-xl p-5 card-hover"
              >
                <span className="text-2xl block mb-2">{stat.icon}</span>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Deployments</h2>
            {services.length === 0 ? (
              <div className="solid-card rounded-xl p-10 text-center text-sm text-white/40">
                No services deployed yet — grab a plan to spin one up.
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service, i) => (
                  <motion.div
                    key={service.name + '-' + i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="solid-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{service.name}</h3>
                        <p className="text-xs text-white/40">{service.plan} • {service.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        service.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {service.status.toUpperCase()}
                      </span>
                      <button className="btn-secondary px-4 py-2 rounded-lg text-xs font-medium text-primary">
                        Manage
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recent Invoices</h2>
              <div className="solid-card rounded-xl overflow-hidden">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-white/40">No invoices yet.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentOrders.map((o) => (
                      <div key={o.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div>
                          <span className="text-sm font-semibold text-white font-mono">{o.invoice_id}</span>
                          <p className="text-xs text-white/30">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">{o.currency === 'INR' ? '₹' : '$'}{Number(o.amount).toFixed(0)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'verified' || o.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                            o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {o.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Support Tickets</h2>
              <div className="solid-card rounded-xl overflow-hidden">
                {recentTickets.length === 0 ? (
                  <div className="p-8 text-center text-sm text-white/40">You haven't opened any tickets.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentTickets.map((t) => (
                      <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div>
                          <span className="text-sm font-semibold text-white">{t.subject}</span>
                          <p className="text-xs text-white/30">{t.ref} • {new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                            t.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {t.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'open' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'
                          }`}>
                            {t.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
