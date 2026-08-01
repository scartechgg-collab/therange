import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/Section';
import { supabase } from '../lib/supabase';

export function SupportPage() {
  const [category, setCategory] = useState('technical');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const categories = [
    { id: 'technical', icon: '🔧', title: 'Technical Support', desc: 'Server issues, performance, errors' },
    { id: 'billing',   icon: '💳', title: 'Billing Support',   desc: 'Payments, invoices, refunds' },
    { id: 'sales',     icon: '💼', title: 'Sales Support',     desc: 'Plans, custom solutions, enterprise' },
  ];

  const submit = async () => {
    if (!name || !email || !subject || !message) {
      setResult({ ok: false, msg: 'Please fill in all fields.' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    const { error } = await supabase.from('tickets').insert({
      name, email, category, priority, subject, message, status: 'open',
    });
    setSubmitting(false);
    if (error) {
      setResult({ ok: false, msg: error.message });
    } else {
      setResult({ ok: true, msg: 'Ticket submitted! Our team will reply shortly.' });
      setSubject(''); setMessage('');
    }
  };

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">🎫</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Support</h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Get help from our expert support team. We're here 24/7.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setCategory(cat.id)}
                className={`solid-card rounded-xl p-6 text-left card-hover transition-all ${
                  category === cat.id ? 'neon-border neon-glow' : ''
                }`}
              >
                <span className="text-3xl block mb-3">{cat.icon}</span>
                <h3 className="text-base font-bold text-white mb-1">{cat.title}</h3>
                <p className="text-xs text-white/40">{cat.desc}</p>
              </motion.button>
            ))}
          </div>

          <Section>
            <div className="solid-card rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Submit a Ticket</h2>

              {result && (
                <div className={`mb-5 rounded-xl px-4 py-3 border text-xs font-semibold ${
                  result.ok ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {result.msg}
                </div>
              )}

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-white/60 block mb-2">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50" />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 block mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 block mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-2">Priority</label>
                  <div className="flex gap-3">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                          priority === p
                            ? p === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : p === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-2">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-2">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none" />
                </div>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold text-white w-full sm:w-auto disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </Section>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="solid-card rounded-xl p-6 card-hover">
              <span className="text-3xl block mb-3">💬</span>
              <h3 className="text-lg font-bold text-white mb-2">Discord Server</h3>
              <p className="text-sm text-white/40 mb-4">Join our Discord community for real-time support and updates.</p>
              <a href="https://discord.com/invite/2WZx6VwP6u" target="_blank" rel="noopener noreferrer"
                className="btn-secondary inline-block px-6 py-2.5 rounded-xl text-sm font-medium text-primary">
                Join Discord
              </a>
            </div>
            <div className="solid-card rounded-xl p-6 card-hover">
              <span className="text-3xl block mb-3">📧</span>
              <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
              <p className="text-sm text-white/40 mb-4">Send us an email for non-urgent inquiries or documentation.</p>
              <span className="text-sm text-primary font-medium">support@rangecloud.gg</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
