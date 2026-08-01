import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeader } from '../components/Section';
import { Page } from '../types';
import { Plan } from '../data/plans';
import { usePlans } from '../hooks/usePlans';
import { useSiteContent } from '../hooks/useSiteContent';

interface HomePageProps {
  navigate: (page: Page) => void;
  currency: 'INR' | 'USD';
  onPurchase: (plan: Plan) => void;
}

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function HomePage({ navigate, currency, onPurchase }: HomePageProps) {
  const [activePlanTab, setActiveTab] = useState<'minecraft' | 'discord' | 'vps'>('minecraft');
  const [activeVpsSub, setActiveVpsSub] = useState<string>('AMD EPYC VPS');
  const { minecraft, discord, vps } = usePlans();
  const content = useSiteContent();

  const symbol = currency === 'INR' ? '₹' : '$';

  const stats = [
    { label: 'Active Space Nodes', value: 2847, suffix: '+', icon: '🌌' },
    { label: 'Pioneering Customers', value: 15200, suffix: '+', icon: '👨‍🚀' },
    { label: 'Galactic Locations', value: 12, suffix: '', icon: '🌍' },
    { label: 'Portal Uptime', value: 99.99, suffix: '%', icon: '⚡' },
  ];

  const whyChoose = [
    { icon: '🚀', title: 'Hyper NVMe SSDs', desc: 'Blazing fast Gen5 NVMe SSDs for instant world loading and zero space lag.' },
    { icon: '🛡️', title: 'Cosmic DDoS Shield', desc: 'Enterprise-grade advanced DDoS filtration keeping your nodes guarded 24/7.' },
    { icon: '⚡', title: 'Instant Warp Launch', desc: 'Deploy within seconds. No delays, start building your cosmic empire instantly.' },
    { icon: '🛸', title: 'Ryzen 9 Processors', desc: 'AMD Ryzen 9 7950X / 9950X processors for ultimate raw computing speed.' },
    { icon: '🌎', title: 'Multi-Orbit Locations', desc: 'Strategically located low-latency space centers in India, US, EU & more.' },
    { icon: '📡', title: '24/7 Deep Space Support', desc: 'Specialist control crew available round-the-clock for deep-space missions.' },
  ];

  const features = [
    { icon: '🪐', title: 'Nebula Portal Installer', desc: 'Deploy any modpack, plugin, or server setup with one simple click.' },
    { icon: '📁', title: 'Sub-Light SFTP Access', desc: 'Gain secure access to root file structures through safe SFTP channels.' },
    { icon: '💾', title: 'Temporal Backups', desc: 'Free snapshot backups so you can roll back time to any safe state.' },
    { icon: '🌐', title: 'Orbit Subdomains', desc: 'Get free professional subdomains to connect your server in style.' },
    { icon: '⌨️', title: 'Quantum Startup Params', desc: 'Tweak JVM startup arguments with complete operational command.' },
    { icon: '🔗', title: 'Cosmic API Access', desc: 'Complete headless API coverage for automated server warp actions.' },
  ];

  const reviews = [
    { name: 'Alex M.', role: 'Empire Builder', rating: 5, text: 'Performance is out of this world. Indian locations are incredibly fast. Sub-10ms ping!' },
    { name: 'Sarah K.', role: 'Federation Admin', rating: 5, text: 'Setting up our modded server was a breeze. No lag with heavy Forge configurations.' },
    { name: 'Jake P.', role: 'Core Developer', rating: 5, text: 'Their Discord bot hosting nodes keep my python codes active with zero interruptions. Brilliant!' },
  ];

  const faqs = [
    { q: 'How fast is server warp-up (setup)?', a: 'Instantly. Once the payment goes through, our systems provision the server immediately.' },
    { q: 'Can I pay with Indian Payment Gateways?', a: 'Yes! We fully support UPI, Netbanking, Credit Cards, PayPal, and more.' },
    { q: 'How is DDoS mitigation configured?', a: 'All India & international nodes include custom low-latency enterprise level DDoS filtering at no extra cost.' },
    { q: 'Can I swap versions later?', a: 'Yes, you can swap between Paper, Purpur, Forge, Fabric or any Custom JAR via the Panel.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const locations = [
    { name: 'Mumbai', x: '67%', y: '45%' },
    { name: 'Singapore', x: '75%', y: '55%' },
    { name: 'Tokyo', x: '82%', y: '35%' },
    { name: 'Sydney', x: '85%', y: '72%' },
    { name: 'New York', x: '25%', y: '35%' },
    { name: 'Los Angeles', x: '12%', y: '38%' },
    { name: 'Dallas', x: '18%', y: '42%' },
    { name: 'London', x: '47%', y: '28%' },
    { name: 'Frankfurt', x: '50%', y: '30%' },
    { name: 'Paris', x: '48%', y: '32%' },
    { name: 'São Paulo', x: '32%', y: '65%' },
    { name: 'Toronto', x: '22%', y: '30%' },
  ];

  // Get active plans (live from Supabase)
  const currentPlans = activePlanTab === 'minecraft'
    ? minecraft
    : activePlanTab === 'discord'
      ? discord
      : vps.filter((p) => p.subCategory === activeVpsSub);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Galaxy Nebulas */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary-dark/20 rounded-full blur-[180px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/10 rounded-full blur-[220px] animate-pulse-glow" style={{ animationDelay: '6s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/30 mb-8 uppercase tracking-widest shadow-[0_0_25px_rgba(0,255,136,0.15)]">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
              {content.get('hero_badge', 'India Space Core Nodes Active')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.12] mb-6 tracking-tight px-1"
          >
            <span className="gradient-font-premium block">Powering The Next</span>
            <span className="gradient-font-premium block">Generation Of</span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent neon-text font-black">
              Game Servers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-sm sm:text-lg md:text-2xl text-white/65 max-w-3xl mx-auto mb-10 sm:mb-12 font-medium px-2"
          >
            High-performance Minecraft, Discord Bot & VPS Hosting with enterprise-grade galactic infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <a href="#plans" className="btn-primary px-10 py-5 rounded-2xl text-base font-bold text-white flex items-center gap-3 w-full sm:w-auto justify-center shadow-lg shadow-primary/20">
              <span>🚀</span>
              Deploy Space Node
            </a>
            <a href="#plans" className="btn-secondary px-10 py-5 rounded-2xl text-base font-bold text-primary flex items-center gap-3 w-full sm:w-auto justify-center">
              View Plans
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </motion.div>

          {/* Core USP Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-8 text-white/30 text-xs font-semibold uppercase tracking-widest"
          >
            <span className="flex items-center gap-2">🛡️ 100% DDoS filtration</span>
            <span className="flex items-center gap-2">⚡ 10 Gbps Ports</span>
            <span className="flex items-center gap-2">🖥️ AMD Ryzen 9 9950X</span>
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="glass rounded-2xl p-6 md:p-8 text-center card-hover neon-border border-primary/10"
              >
                <span className="text-3xl mb-3 block">{stat.icon}</span>
                <div className="text-3xl md:text-4xl font-black text-white mb-2 neon-text">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PLANS SECTION */}
      <Section id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="WARP PORTAL"
            title="Deploy Galactic Hardware"
            subtitle="Select your preferred technology orbit and configure your server."
          />

          {/* Pricing Tabs */}
          <div className="flex flex-col items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-1 sm:gap-2 solid-card p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'minecraft', label: 'Minecraft', full: 'Minecraft Node', icon: '⛏️' },
                { id: 'discord', label: 'Discord', full: 'Discord Bot Node', icon: '🤖' },
                { id: 'vps', label: 'VPS', full: 'EPYC & Ryzen VPS', icon: '🖥️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                    activePlanTab === tab.id
                      ? 'btn-primary text-white shadow-md'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.full}</span>
                </button>
              ))}
            </div>

            {/* VPS Sub-Categories */}
            {activePlanTab === 'vps' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 solid-card-alt p-1 rounded-xl max-w-full overflow-x-auto"
              >
                {['AMD EPYC VPS', 'RYZEN 7 7700X VPS', 'RYZEN 9 9950X VPS'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveVpsSub(sub)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all whitespace-nowrap ${
                      activeVpsSub === sub ? 'bg-primary text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {currentPlans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
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
                    <h3 className="text-xl font-black text-white tracking-wide">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-black text-white">{symbol}{plan.price[currency]}</span>
                      <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">/mo</span>
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
                      {plan.location && (
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-xs text-white/45 uppercase tracking-wider font-medium">Location</span>
                          <span className="text-sm font-bold text-accent">{plan.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs text-white/45 uppercase tracking-wider font-medium">Protection</span>
                        <span className="text-sm font-bold text-green-400">DDoS Secured</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onPurchase(plan)}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                      plan.popular ? 'btn-primary text-white' : 'btn-secondary text-primary hover:text-white'
                    }`}
                  >
                    Deploy Node
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* Why Choose */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="INFRASTRUCTURE"
            title="Engineered For Cosmic Speed"
            subtitle="AMD Ryzen cores, advanced DDR5 ECC RAM, and Indian space-nodes."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring' }}
                className="glass rounded-2xl p-8 card-hover group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features Grid */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="TECHNOLOGY"
            title="Complete Starfleet Control"
            subtitle="Advanced tools built for simple node fleet coordination."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 card-hover group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{feat.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">{feat.title}</h3>
                    <p className="text-white/40 text-sm">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Global Locations Map */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="COMM-NETWORK"
            title="Worldwide Orbital Hubs"
            subtitle="Deploy close to your operations base. Low-latency is guaranteed globally."
          />
          <div className="relative glass rounded-3xl p-8 md:p-12 overflow-hidden border-white/5">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 25% 35%, rgba(0,168,255,0.3) 2px, transparent 2px),
                  radial-gradient(circle at 50% 30%, rgba(0,168,255,0.3) 2px, transparent 2px),
                  radial-gradient(circle at 75% 55%, rgba(0,168,255,0.3) 2px, transparent 2px),
                  radial-gradient(circle at 85% 72%, rgba(0,168,255,0.3) 2px, transparent 2px)`,
              }} />
            </div>
            <div className="relative aspect-[2/1] max-w-4xl mx-auto">
              <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[150px] sm:text-[200px] font-bold select-none">
                🌌
              </div>
              {locations.map((loc, i) => (
                <motion.div
                  key={loc.name}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className="absolute group"
                  style={{ left: loc.x, top: loc.y }}
                >
                  <div className="relative">
                    <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-lg shadow-primary/50 group-hover:scale-150 transition-transform cursor-pointer" />
                    <div className="absolute w-3.5 h-3.5 bg-primary/50 rounded-full animate-ping" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-dark-card border border-primary/20 text-xs text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {loc.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Reviews */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="MISSIONS LOG"
            title="Reviewed by Commanders"
            subtitle="Verified server administrators around the globe share their experiences."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 card-hover border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-white/40">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="TRANSMISSIONS"
            title="Common Inquiries"
            subtitle="Everything you need to know about setting up your orbital base."
          />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl overflow-hidden border-white/5"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden border-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-dark/10 to-accent/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready To Launch Your Node?
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                Join 15,000+ captains trust Range Cloud Hosting. Deploy in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#plans" className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold text-white flex items-center gap-2 justify-center w-full sm:w-auto">
                  <span>🚀</span>
                  Launch Space Server
                </a>
                <button onClick={() => navigate('contact')} className="btn-secondary px-8 py-4 rounded-2xl text-base font-semibold text-primary w-full sm:w-auto">
                  Contact Fleet Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
