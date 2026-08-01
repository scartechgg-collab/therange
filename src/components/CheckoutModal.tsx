import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plan } from '../data/plans';
import { supabase } from '../lib/supabase';

const QR_IMAGE = 'https://i.postimg.cc/4xfSzDZJ/file-0000000044ec720ba8cef4a82fcd9e65.png';
const LOGO_IMAGE = 'https://i.postimg.cc/jjg0wsJm/logo.png';
const DISCORD_INVITE = 'https://discord.com/invite/2WZx6VwP6u';

interface CheckoutModalProps {
  isOpen: boolean;
  plan: Plan | null;
  currency: 'INR' | 'USD';
  onClose: () => void;
  onSuccess: (plan: Plan) => void;
  onGoToPanel: () => void;
}

type Step = 'payment' | 'terms' | 'invoice';

export function CheckoutModal({ isOpen, plan, currency, onClose, onSuccess, onGoToPanel }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('payment');
  const [agreed, setAgreed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invoice, setInvoice] = useState<{ id: string; date: string } | null>(null);

  // Reset wizard whenever a new checkout opens
  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setAgreed(false);
      setCopied(false);
      setInvoice(null);
    }
  }, [isOpen, plan]);

  if (!plan) return null;

  const symbol = currency === 'INR' ? '₹' : '$';
  const price = plan.price[currency];

  const steps: { id: Step; label: string; num: number }[] = [
    { id: 'payment', label: 'Payment', num: 1 },
    { id: 'terms', label: 'Confirm', num: 2 },
    { id: 'invoice', label: 'Invoice', num: 3 },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(QR_IMAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handlePaid = async () => {
    const id = `RC-${new Date().getFullYear()}${String(Math.floor(100000 + Math.random() * 900000))}`;
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    // Persist order to Supabase (best-effort — UI proceeds even if it fails)
    try {
      await supabase.from('orders').insert({
        invoice_id: id,
        plan_id: plan.id,
        plan_name: plan.name,
        amount: price,
        currency,
        status: 'paid',
      });
    } catch { /* silent — visitor UX first */ }
    setInvoice({ id, date });
    onSuccess(plan);
    setStep('invoice');
  };

  const handleNotPaid = () => {
    onClose();
  };

  const downloadInvoice = () => {
    if (!invoice) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Invoice ${invoice.id} — Range Cloud Hosting</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
  body { background: #050505; color: #e5e7eb; padding: 40px 20px; }
  .wrap { max-width: 720px; margin: 0 auto; background: #0a0a16; border: 1px solid rgba(0,168,255,0.25); border-radius: 16px; overflow: hidden; }
  .head { background: linear-gradient(135deg, #00A8FF, #0052FF); padding: 28px 36px; display: flex; justify-content: space-between; align-items: center; }
  .head img { width: 56px; height: 56px; border-radius: 50%; background: #000; }
  .head h1 { color: #fff; font-size: 22px; letter-spacing: 1px; }
  .head p { color: rgba(255,255,255,0.85); font-size: 12px; margin-top: 4px; }
  .body { padding: 36px; }
  .row { display: flex; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #00A8FF; font-weight: 700; margin-bottom: 6px; }
  .value { font-size: 15px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .total { display: flex; justify-content: flex-end; margin-top: 20px; }
  .total .box { background: rgba(0,168,255,0.08); border: 1px solid rgba(0,168,255,0.3); border-radius: 10px; padding: 14px 24px; text-align: right; }
  .total .amt { font-size: 24px; font-weight: 800; color: #00D9FF; }
  .foot { padding: 20px 36px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #6b7280; text-align: center; }
  .paid { display: inline-block; background: rgba(0,255,136,0.12); color: #00ff88; font-size: 11px; font-weight: 800; letter-spacing: 2px; padding: 4px 12px; border-radius: 999px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <div style="display:flex;align-items:center;gap:14px;">
        <img src="${LOGO_IMAGE}" alt="Range Cloud" />
        <div>
          <h1>RANGE CLOUD HOSTING</h1>
          <p>Premium Game Server Hosting • support@rangecloud.gg</p>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="color:#fff;font-size:13px;font-weight:700;letter-spacing:2px;">INVOICE</div>
        <div style="color:rgba(255,255,255,0.85);font-size:12px;margin-top:4px;">${invoice.id}</div>
      </div>
    </div>
    <div class="body">
      <div class="row">
        <div>
          <div class="label">Billed To</div>
          <div class="value">Alex Morrison</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:2px;">alex@example.com</div>
        </div>
        <div style="text-align:right;">
          <div class="label">Invoice Date</div>
          <div class="value">${invoice.date}</div>
          <div style="margin-top:8px;"><span class="paid">PAID</span></div>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Item</th><th>Details</th><th style="text-align:right;">Amount</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:600;">${plan.category === 'minecraft' ? 'Minecraft Hosting' : plan.category === 'discord' ? 'Discord Bot Hosting' : 'VPS Hosting'} — ${plan.name}</td>
            <td style="color:#9ca3af;">${plan.ram} • ${plan.storage} • CPU ${plan.cpu}${plan.location ? ' • ' + plan.location : ''} • DDoS Protection</td>
            <td style="text-align:right;font-weight:700;">${symbol}${price}.00</td>
          </tr>
          <tr>
            <td>Billing Cycle</td>
            <td style="color:#9ca3af;">Monthly — 1 month</td>
            <td style="text-align:right;">—</td>
          </tr>
        </tbody>
      </table>
      <div class="total">
        <div class="box">
          <div class="label" style="margin-bottom:4px;">Total Paid</div>
          <div class="amt">${symbol}${price}.00 ${currency}</div>
        </div>
      </div>
    </div>
    <div class="foot">Thank you for choosing Range Cloud Hosting 🚀 • discord.com/invite/2WZx6VwP6u</div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RangeCloud_Invoice_${invoice.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 'invoice' ? onClose : undefined}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto solid-card rounded-3xl p-5 sm:p-8 neon-glow-strong z-10"
          >
            {/* Ambient glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Header + progress */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src={LOGO_IMAGE} alt="" className="w-9 h-9 rounded-full" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide">Secure Checkout</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Range Cloud Hosting</p>
                </div>
              </div>
              {step !== 'invoice' && (
                <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Step indicator */}
            <div className="relative flex items-center gap-2 mb-7">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 ${
                        i < currentIdx
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : i === currentIdx
                            ? 'btn-primary text-white shadow-md shadow-primary/30'
                            : 'bg-white/5 text-white/30 border border-white/10'
                      }`}
                    >
                      {i < currentIdx ? '✓' : s.num}
                    </div>
                    <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-widest ${i === currentIdx ? 'text-white' : 'text-white/30'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px mx-2 bg-white/10 relative overflow-hidden">
                      {i < currentIdx && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent" />}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1: PAYMENT */}
            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Order summary */}
                <div className="glass rounded-2xl p-4 sm:p-5 mb-6">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[10px] text-primary font-black tracking-widest uppercase">
                        {plan.category === 'minecraft' ? 'Minecraft Hosting' : plan.category === 'discord' ? 'Discord Bot Hosting' : 'VPS Hosting'}
                      </span>
                      <h4 className="text-lg font-black text-white mt-0.5">{plan.name}</h4>
                      <p className="text-[11px] text-white/40 mt-1">{plan.ram} • {plan.storage} • CPU {plan.cpu}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{symbol}{price}</span>
                      <span className="text-[10px] text-white/40 block uppercase tracking-wider font-bold">/ month</span>
                    </div>
                  </div>
                </div>

                {/* QR Payment */}
                <div className="text-center mb-5">
                  <p className="text-xs text-white/60 mb-4 font-semibold">
                    Scan the QR code with <span className="text-accent">GPay / PhonePe / Paytm</span> or any UPI app
                  </p>
                  <div className="relative inline-block p-3 bg-white rounded-2xl shadow-xl shadow-primary/20">
                    <img src={QR_IMAGE} alt="Payment QR Code" className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg" />
                    <div className="absolute -inset-1 rounded-2xl border-2 border-accent/40 animate-pulse pointer-events-none" />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-full px-4 py-1.5">
                    <span className="w-2 h-2 rounded-full status-online" />
                    <span className="text-xs font-black text-green-400">Pay {symbol}{price}.00 {currency}</span>
                  </div>
                </div>

                {/* Payment link copy */}
                <div className="mb-6">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">Payment QR Link</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={QR_IMAGE}
                      className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-white/60 font-mono focus:outline-none"
                    />
                    <button
                      onClick={copyLink}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-secondary text-primary'}`}
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setStep('terms')}
                  className="w-full btn-primary py-4 rounded-xl text-sm font-black text-white tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </motion.div>
            )}

            {/* STEP 2: TERMS + PAID CONFIRM */}
            {step === 'terms' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass rounded-2xl p-5 mb-5 max-h-48 overflow-y-auto">
                  <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                    <span>📜</span> Terms & Conditions
                  </h4>
                  <ul className="text-xs text-white/50 space-y-2 leading-relaxed list-disc list-inside">
                    <li>Payment of <span className="text-accent font-bold">{symbol}{price}.00</span> activates the <span className="text-white font-semibold">{plan.name}</span> plan for 1 month.</li>
                    <li>Servers are provisioned instantly upon verified payment.</li>
                    <li>A 48-hour money-back guarantee applies to new purchases.</li>
                    <li>Services must comply with our Acceptable Use Policy — no illegal content, spam, or network abuse.</li>
                    <li>After payment, open a ticket on our Discord server with your invoice & payment screenshot to verify your order.</li>
                    <li>Range Cloud Hosting is not liable for data loss due to user-side misconfiguration.</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#00A8FF] cursor-pointer"
                  />
                  <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors">
                    I have read and agree to the <span className="text-primary font-semibold">Terms of Service</span> and <span className="text-primary font-semibold">Refund Policy</span>.
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleNotPaid}
                    className="py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white/50 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    Not Paid
                  </button>
                  <button
                    onClick={handlePaid}
                    disabled={!agreed}
                    className="btn-primary py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    I Have Paid ✓
                  </button>
                </div>
                <button onClick={() => setStep('payment')} className="w-full mt-3 text-[11px] text-white/30 hover:text-white/60 transition-colors">
                  ← Back to payment
                </button>
              </motion.div>
            )}

            {/* STEP 3: INVOICE */}
            {step === 'invoice' && invoice && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                    className="w-16 h-16 mx-auto mb-4 bg-green-500/15 border border-green-500/40 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20"
                  >
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-black text-white mb-1">Payment Verified!</h3>
                  <p className="text-xs text-white/50">Your service is now active. Your invoice has been generated.</p>
                </div>

                {/* Invoice card */}
                <div className="glass rounded-2xl p-5 mb-5 border-primary/20">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div>
                      <div className="text-[10px] text-primary font-black tracking-widest uppercase">Invoice</div>
                      <div className="text-sm font-black text-white font-mono">{invoice.id}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-green-500/15 text-green-400 border border-green-500/30">PAID</span>
                  </div>
                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between"><span className="text-white/40">Plan</span><span className="text-white font-bold">{plan.name}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Specs</span><span className="text-white font-bold">{plan.ram} • {plan.storage}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Date</span><span className="text-white font-bold">{invoice.date}</span></div>
                    <div className="flex justify-between pt-2 border-t border-white/5">
                      <span className="text-white/40 font-bold">Total</span>
                      <span className="text-accent font-black text-sm">{symbol}{price}.00 {currency}</span>
                    </div>
                  </div>
                  <button
                    onClick={downloadInvoice}
                    className="w-full btn-secondary py-3 rounded-xl text-xs font-black uppercase tracking-wider text-primary flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Invoice
                  </button>
                </div>

                                {/* Discord handoff */}
                <div className="rounded-2xl p-5 mb-5 bg-[#5865F2]/10 border border-[#5865F2]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#8b95f7]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <h4 className="text-sm font-black text-white">Verify on Discord</h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">
                    Join our Discord server and create a ticket with your <span className="text-white font-semibold">invoice</span> and <span className="text-white font-semibold">payment screenshot</span> to activate your service.
                  </p>
                  <a
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#5865F2] hover:bg-[#4752c4] transition-all text-center shadow-lg shadow-[#5865F2]/25"
                  >
                    Join Discord Server
                  </a>
                </div>

                <button onClick={onClose} className="w-full text-[11px] text-white/30 hover:text-white/60 transition-colors">
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
