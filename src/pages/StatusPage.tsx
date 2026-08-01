import { motion } from 'framer-motion';
import { Section, SectionHeader } from '../components/Section';
import { useLiveTable } from '../hooks/useLiveTable';

interface Service { id: string; name: string; status: string; uptime: string; response_ms: number; sort_order: number; }
interface Incident { id: string; title: string; description: string; status: string; severity: string; occurred_at: string; }

export function StatusPage() {
  const services  = useLiveTable<Service>('service_status', { orderBy: 'sort_order', ascending: true });
  const incidents = useLiveTable<Incident>('incidents',     { orderBy: 'occurred_at', ascending: false });

  const allOperational = services.rows.length > 0 && services.rows.every((s) => s.status === 'operational');

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">📊</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">System Status</h1>
            <p className="text-white/50 text-lg">Real-time monitoring of all Range Cloud services.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`solid-card rounded-2xl p-6 mb-8 flex items-center gap-4`}
          >
            <div className={`w-4 h-4 rounded-full ${allOperational ? 'status-online' : services.rows.length === 0 ? 'status-maintenance' : 'status-maintenance'}`} />
            <div>
              <h2 className={`text-lg font-bold ${allOperational ? 'text-green-400' : 'text-yellow-400'}`}>
                {services.loading ? 'Fetching status…' : services.rows.length === 0 ? 'No monitors configured' : allOperational ? 'All Systems Operational' : 'Partial System Notice'}
              </h2>
              <p className="text-sm text-white/40">Live from Range Cloud infrastructure</p>
            </div>
          </motion.div>

          <div className="space-y-3 mb-16">
            {services.rows.length === 0 && !services.loading && (
              <div className="solid-card rounded-xl p-8 text-center text-sm text-white/40">
                No service monitors have been added yet.
              </div>
            )}
            {services.rows.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="solid-card rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'operational' ? 'status-online' :
                    service.status === 'maintenance' ? 'status-maintenance' : 'status-offline'
                  }`} />
                  <span className="text-sm font-medium text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-white/40">
                  <span className="hidden sm:inline">Uptime: {service.uptime}</span>
                  <span className="hidden sm:inline">{service.response_ms}ms</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    service.status === 'operational' ? 'bg-green-500/10 text-green-400' :
                    service.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-400' :
                    service.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <Section>
            <SectionHeader badge="INCIDENTS" title="Incident History" />
            {incidents.rows.length === 0 ? (
              <div className="solid-card rounded-xl p-10 text-center text-sm text-white/40">
                🎉 No incidents to report.
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.rows.map((incident, i) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="solid-card rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{incident.title}</h3>
                        <p className="text-xs text-white/30">{new Date(incident.occurred_at).toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                        incident.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                        incident.status === 'monitoring' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-white/40">{incident.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </section>
    </div>
  );
}
