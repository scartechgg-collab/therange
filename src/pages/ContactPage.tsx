import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent';

export function ContactPage() {
  const content = useSiteContent();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">📞</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Contact Us</h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Have a question or need help? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-4">
              {[
                { icon: '📧', title: 'Email', value: content.get('contact_email', 'support@rangecloud.gg'), sub: 'We reply within 2 hours' },
                { icon: '💬', title: 'Discord', value: content.get('contact_discord', 'https://discord.com/invite/2WZx6VwP6u'), sub: 'Join our community' },
                { icon: '🎫', title: 'Support Tickets', value: 'panel.rangecloud.gg', sub: '24/7 ticket support' },
                { icon: '🌍', title: 'Locations', value: 'Global Infrastructure', sub: '12 locations worldwide' },
              ].map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-5 card-hover"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{info.title}</h3>
                      <p className="text-sm text-primary">{info.value}</p>
                      <p className="text-xs text-white/30">{info.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3 glass rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-white/60 block mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 block mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <button className="btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold text-white w-full sm:w-auto">
                  Send Message
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
