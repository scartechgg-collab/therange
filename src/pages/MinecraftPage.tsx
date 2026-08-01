import { motion } from 'framer-motion';
import { Section, SectionHeader } from '../components/Section';
import { Page } from '../types';
import { Plan } from '../data/plans';
import { usePlans } from '../hooks/usePlans';

interface MinecraftPageProps {
  navigate: (page: Page) => void;
  currency: 'INR' | 'USD';
  onPurchase: (plan: Plan) => void;
}

export function MinecraftPage({ navigate, currency, onPurchase }: MinecraftPageProps) {
  const symbol = currency === 'INR' ? '₹' : '$';
  const { minecraft: minecraftPlans } = usePlans();

  const features = [
    '⚡ Sub-Light Launch (Instant Setup)',
    '🔌 Cosmic Plugin Engine (Plugin Support)',
    '🔧 Nebula Mod Support (Mod Support)',
    '📁 Zero-G FTP File Access',
    '🎛️ Starfleet Control Panel (Pterodactyl)',
    '🛡️ Temporal DDoS filtration',
    '💾 Hyper-Speed NVMe Storage',
    '🔄 Orbit Auto Backups',
    '🌐 Stellar Subdomain Generator',
    '📊 Resource Metrics Dashboard',
    '⌨️ Raw Quantum Console Access',
    '🎮 Warp Version Swapper',
  ];

  const benchmarks = [
    { label: 'World Generation', value: 98, unit: 'Chunks/s' },
    { label: 'TPS under Peak Load', value: 20, unit: 'TPS' },
    { label: 'Engine Spin Up Time', value: 95, unit: '% faster' },
    { label: 'Quantum Cache Read Speed', value: 92, unit: '% faster' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Nebulas and particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-6xl mb-4 block">⛏️</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
              Minecraft <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent neon-text">Hosting</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 font-medium">
              AMD Ryzen-powered servers and high-speed NVMe storage optimized for massive multiplayer galactic coordinates. Zero lag, India Locations, and total command.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing / Plan List */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="INDIAN ORBIT CORES"
            title="Premium Minecraft Plans"
            subtitle="Transparent monthly plans with high single-thread clock speeds."
          />

          {/* Plans Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {minecraftPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
                className={`relative solid-card rounded-3xl p-6 sm:p-8 card-hover overflow-hidden flex flex-col justify-between ${
                  plan.popular ? 'gradient-border neon-glow-strong' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-md shadow-primary/20">
                    🌌 POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-accent tracking-widest bg-accent/10 px-2 py-0.5 rounded">INDIA LOCATION</span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-wide">{plan.name}</h3>
                  
                  <div className="mt-4 flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-white">{symbol}{plan.price[currency]}</span>
                    <span className="text-white/45 text-xs uppercase tracking-wider font-semibold">/mo</span>
                  </div>

                  <div className="space-y-3.5 mb-8">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-white/45 uppercase tracking-wider font-medium">RAM</span>
                      <span className="text-sm font-bold text-white">{plan.ram}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-white/45 uppercase tracking-wider font-medium">Storage</span>
                      <span className="text-sm font-bold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-white/45 uppercase tracking-wider font-medium">CPU Cores</span>
                      <span className="text-sm font-bold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs text-white/45 uppercase tracking-wider font-medium font-bold">DDoS</span>
                      <span className="text-sm font-bold text-green-400">Included</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onPurchase(plan)}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    plan.popular ? 'btn-primary text-white shadow-md' : 'btn-secondary text-primary hover:text-white'
                  }`}
                >
                  Deploy Node
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="MISSION SYSTEM" title="Fleet Systems Packaged" subtitle="Every Minecraft deployment receives full operational clearance." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 text-center card-hover border-white/5"
              >
                <span className="text-xs font-bold text-white/70">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Performance Benchmarks */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="METRICS" title="Orbital Velocity Results" subtitle="Single-thread AMD Ryzen 9 9950X performance benchmarks." />
          <div className="grid sm:grid-cols-2 gap-6">
            {benchmarks.map((bench, i) => (
              <motion.div
                key={bench.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border-white/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white/60">{bench.label}</span>
                  <span className="text-sm font-black text-primary">{bench.value} {bench.unit}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bench.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Launch Your Galactic Mission Today</h2>
            <p className="text-white/50 mb-8 text-sm">Deploy in seconds. Complete sub-millisecond network speeds.</p>
            <button onClick={() => navigate('store')} className="btn-primary px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white">
              Launch Space Node
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
