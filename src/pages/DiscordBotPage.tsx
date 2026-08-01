import { motion } from 'framer-motion';
import { Section, SectionHeader } from '../components/Section';
import { Page } from '../types';
import { Plan } from '../data/plans';
import { usePlans } from '../hooks/usePlans';

interface DiscordBotPageProps {
  navigate: (page: Page) => void;
  currency: 'INR' | 'USD';
  onPurchase: (plan: Plan) => void;
}

export function DiscordBotPage({ navigate, currency, onPurchase }: DiscordBotPageProps) {
  const symbol = currency === 'INR' ? '₹' : '$';
  const { discord: discordPlans } = usePlans();

  const features = [
    { icon: '⏰', title: '24/7 Deep Space Uptime', desc: 'Your bot stays online around the clock with auto warp recovery.' },
    { icon: '📗', title: 'Quantum Node.js Support', desc: 'Full support for Node.js 18+ with fast npm/yarn package managers.' },
    { icon: '🐍', title: 'Cosmic Python Engines', desc: 'Python 3.10+ with pip support and fully sandboxed environments.' },
    { icon: '🔗', title: 'Git Ship Integration', desc: 'Auto-deploy from GitHub repositories with direct secure webhooks.' },
    { icon: '🔄', title: 'Automatic Subsystem Restart', desc: 'Auto-restart on crash with fully configurable restart policies.' },
    { icon: '💻', title: 'Warp Console Access', desc: 'Full console access through our premium space Panel.' },
    { icon: '📊', title: 'System Diagnostics', desc: 'Real-time CPU, RAM, and disk usage telemetry.' },
    { icon: '🔐', title: 'Quantum Env Protection', desc: 'Secure environment variable management for tokens & secret keys.' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-6xl mb-4 block">🤖</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
              Discord Bot <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent neon-text">Hosting</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 font-medium">
              Keep your Discord bot active 24/7 in space orbits with enterprise-grade low-latency nodes. Ready for massive servers with high events count.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="PLANETARY DEPLOYMENT" title="Bot Hosting Plans" subtitle="Affordable pricing with stellar node uptime." />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {discordPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
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
                      <span className="text-xs text-white/45 uppercase tracking-wider font-medium">CPU</span>
                      <span className="text-sm font-bold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-xs text-white/45 uppercase tracking-wider font-medium">Uptime</span>
                      <span className="text-sm font-bold text-green-400">99.99%</span>
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
          <SectionHeader badge="CAPABILITIES" title="Built For Bot Engineers" subtitle="Everything you need to keep your bots operational." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 card-hover border-white/5"
              >
                <span className="text-3xl block mb-3">{feat.icon}</span>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{feat.title}</h3>
                <p className="text-white/40 text-xs">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px]" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Launch Your Bot Instantly</h2>
            <p className="text-white/50 mb-8 text-sm">Your bot will join orbital streams in under 60 seconds.</p>
            <button onClick={() => navigate('store')} className="btn-primary px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white">
              Launch Bot Node
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
