import { Page } from '../types';
import { Logo } from './Logo';
import { CrazyStudioWatermark } from './CrazyStudioWatermark';

interface FooterProps {
  navigate: (page: Page) => void;
}

export function Footer({ navigate }: FooterProps) {
  const footerSections = [
    {
      title: 'Hosting',
      links: [
        { label: 'Minecraft Hosting', page: 'minecraft' as Page },
        { label: 'Discord Bot Hosting', page: 'discord' as Page },
        { label: 'Store', page: 'store' as Page },
        { label: 'Panel Preview', page: 'panel' as Page },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Knowledgebase', page: 'knowledgebase' as Page },
        { label: 'Support Tickets', page: 'support' as Page },
        { label: 'Contact Us', page: 'contact' as Page },
        { label: 'Status Page', page: 'status' as Page },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', page: 'about' as Page },
        { label: 'Panel', page: 'client' as Page },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', page: 'terms' as Page },
        { label: 'Privacy Policy', page: 'privacy' as Page },
        { label: 'Refund Policy', page: 'refund' as Page },
        { label: 'Acceptable Use', page: 'aup' as Page },
      ],
    },
  ];

  return (
    <footer className="relative z-10 border-t border-primary/10">
      {/* Animated glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-3 group mb-4">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Logo size={42} />
              </div>
              <div className="text-left">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Range</span>
                <span className="text-lg font-light text-white/80 ml-1">Cloud</span>
              </div>
            </button>
            <p className="text-sm text-white/40 mb-6 max-w-xs">
              Premium space game server hosting with advanced AMD Ryzen cores. Powering the next generation of games.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {['Discord', 'Twitter', 'GitHub'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group">
                  <span className="text-white/40 group-hover:text-primary transition-colors text-xs font-medium">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="text-left">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest text-white/60">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.page)}
                      className="text-sm text-white/40 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 text-center md:text-left">
            © {new Date().getFullYear()} Range Cloud Hosting. All rights reserved.
          </p>
          <div className="flex flex-col items-center md:items-end gap-3">
            {/* Made by CrazyStudio watermark */}
            <CrazyStudioWatermark />

            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => navigate('status')} className="text-xs text-white/30 hover:text-primary transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full status-online" />
                All Systems Operational
              </button>

              {/* Admin console access */}
            <button
              onClick={() => navigate('admin')}
              title="Admin Console"
              aria-label="Admin Console"
              className="group relative w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/15 hover:border-primary/40 transition-all duration-300"
            >
              <svg className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black border border-primary/25 text-[9px] font-black uppercase tracking-widest text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}
