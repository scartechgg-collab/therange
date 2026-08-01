import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

export function Navbar({ navigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hostingDropdown, setHostingDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Hosting', page: null, dropdown: true },
    { label: 'Store', page: 'store' as Page },
    { label: 'Status', page: 'status' as Page },
    { label: 'Knowledgebase', page: 'knowledgebase' as Page },
    { label: 'Support', page: 'support' as Page },
    { label: 'About', page: 'about' as Page },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-strong shadow-lg shadow-primary/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button onClick={() => navigate('home')} className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Logo size={42} />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Range</span>
                <span className="text-xl font-light text-white/80 ml-1">Cloud</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative"
                  onMouseEnter={() => item.dropdown && setHostingDropdown(true)}
                  onMouseLeave={() => item.dropdown && setHostingDropdown(false)}
                >
                  <button
                    onClick={() => item.page && navigate(item.page)}
                    className={`px-4 py-2 rounded-lg text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1
                      ${(!item.dropdown && currentPage === item.page) ? 'text-primary bg-primary/10' : 'text-white/70 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg className={`w-4 h-4 transition-transform ${hostingDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  {item.dropdown && (
                    <AnimatePresence>
                      {hostingDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          className="absolute top-full left-0 mt-2 w-64 glass-strong rounded-xl p-2 neon-glow border border-primary/20"
                        >
                          <button onClick={() => { navigate('minecraft'); setHostingDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-all group text-left">
                            <span className="text-2xl">⛏️</span>
                            <div>
                              <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Minecraft Hosting</div>
                              <div className="text-xs text-white/50">India & Global Space Nodes</div>
                            </div>
                          </button>
                          <button onClick={() => { navigate('discord'); setHostingDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-all group text-left">
                            <span className="text-2xl">🤖</span>
                            <div>
                              <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Discord Bot Hosting</div>
                              <div className="text-xs text-white/50">Ultra efficient CPU cores</div>
                            </div>
                          </button>
                          <div className="border-t border-white/5 my-1" />
                          <button onClick={() => { navigate('panel'); setHostingDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-all group text-left">
                            <span className="text-2xl">🎛️</span>
                            <div>
                              <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Panel Preview</div>
                              <div className="text-xs text-white/50">Simulated control panel</div>
                            </div>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => navigate('client')} className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-primary">
                Panel
              </button>
              <button onClick={() => navigate('minecraft')} className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white">
                Deploy Server
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-80 glass-strong p-6 pt-20"
            >
              <div className="space-y-2">
                {[
                  { label: 'Home', page: 'home' as Page },
                  { label: 'Minecraft Hosting', page: 'minecraft' as Page },
                  { label: 'Discord Bot Hosting', page: 'discord' as Page },
                  { label: 'Store', page: 'store' as Page },
                  { label: 'Status', page: 'status' as Page },
                  { label: 'Knowledgebase', page: 'knowledgebase' as Page },
                  { label: 'Support', page: 'support' as Page },
                  { label: 'About', page: 'about' as Page },
                  { label: 'Panel Preview', page: 'panel' as Page },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.page); setMobileOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all
                      ${currentPage === item.page ? 'text-primary bg-primary/10' : 'text-white/70 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <button onClick={() => { navigate('client'); setMobileOpen(false); }} className="w-full btn-secondary px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-primary text-center">
                  Panel
                </button>
                <button onClick={() => { navigate('minecraft'); setMobileOpen(false); }} className="w-full btn-primary px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white text-center">
                  Deploy Server
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
