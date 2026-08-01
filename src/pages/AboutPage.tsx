import { motion } from 'framer-motion';
import { Section, SectionHeader } from '../components/Section';
import { useSiteContent } from '../hooks/useSiteContent';

export function AboutPage() {
  const content = useSiteContent();
  const timeline = [
    { year: '2022', title: 'Founded', desc: 'Range Cloud Hosting was born from a passion for gaming and technology.' },
    { year: '2023', title: 'Global Expansion', desc: 'Expanded to 8 global locations with enterprise-grade hardware.' },
    { year: '2024', title: '10K Customers', desc: 'Reached 10,000 active customers and launched Discord Bot hosting.' },
    { year: '2025', title: 'Next Gen Hardware', desc: 'Upgraded entire fleet to AMD Ryzen 9 7950X and Gen5 NVMe SSDs.' },
    { year: '2026', title: 'The Future', desc: 'Continuing to innovate with AI-powered server optimization and more.' },
  ];

  const values = [
    { icon: '⚡', title: 'Performance First', desc: 'We never compromise on performance. Every decision is made with speed in mind.' },
    { icon: '🛡️', title: 'Reliability', desc: 'Our 99.99% uptime guarantee is backed by redundant infrastructure and 24/7 monitoring.' },
    { icon: '💡', title: 'Innovation', desc: 'We constantly push boundaries with cutting-edge technology and creative solutions.' },
    { icon: '🤝', title: 'Community', desc: 'Our customers are our partners. We build what you need and listen to feedback.' },
  ];

  const infrastructure = [
    { label: 'CPU', value: 'AMD Ryzen 9 7950X', icon: '🔧' },
    { label: 'RAM', value: 'DDR5 ECC Memory', icon: '💾' },
    { label: 'Storage', value: 'Gen5 NVMe SSDs', icon: '📦' },
    { label: 'Network', value: '10 Gbps Uplink', icon: '🌐' },
    { label: 'Protection', value: 'Enterprise DDoS', icon: '🛡️' },
    { label: 'Locations', value: '12 Global DCs', icon: '🗺️' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-5xl mb-4 block">🏢</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">About Range Cloud</h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              We're on a mission to make high-performance game server hosting accessible to everyone.
              Built by gamers, for gamers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="solid-card rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-white/50 text-sm leading-relaxed whitespace-pre-line">
              <p>{content.get('about_story', 'Range Cloud Hosting delivers premium game server hosting at accessible prices.')}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="solid-card rounded-2xl p-8 card-hover"
            >
              <span className="text-3xl block mb-4">🎯</span>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                {content.get('about_mission', 'To provide the most reliable, high-performance game server hosting at prices everyone can afford.')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="solid-card rounded-2xl p-8 card-hover"
            >
              <span className="text-3xl block mb-4">🔭</span>
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                {content.get('about_vision', "To become the world's most trusted game hosting platform.")}
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="OUR VALUES" title="What Drives Us" />
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover group"
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{value.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{value.title}</h3>
                <p className="text-sm text-white/40">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="JOURNEY" title="Our Timeline" />
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            {timeline.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-8 mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50 mt-1.5 z-10" />
                <div className="ml-12 md:ml-0 md:w-1/2 glass rounded-xl p-5">
                  <span className="text-xs font-bold text-primary">{event.year}</span>
                  <h3 className="text-base font-bold text-white mt-1">{event.title}</h3>
                  <p className="text-sm text-white/40 mt-1">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Infrastructure */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="INFRASTRUCTURE" title="Enterprise-Grade Hardware" subtitle="We use only the best hardware to power your servers." />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {infrastructure.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-5 text-center card-hover"
              >
                <span className="text-2xl block mb-2">{item.icon}</span>
                <div className="text-xs text-white/40">{item.label}</div>
                <div className="text-sm font-bold text-white mt-1">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
