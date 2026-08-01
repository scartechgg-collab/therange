import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MinecraftPage } from './pages/MinecraftPage';
import { DiscordBotPage } from './pages/DiscordBotPage';
import { StorePage } from './pages/StorePage';
import { StatusPage } from './pages/StatusPage';
import { KnowledgebasePage } from './pages/KnowledgebasePage';
import { ClientAreaPage } from './pages/ClientAreaPage';
import { SupportPage } from './pages/SupportPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { LegalPage } from './pages/LegalPage';
import { PanelPreviewPage } from './pages/PanelPreviewPage';
import { ScrollTopButton } from './components/ScrollTopButton';
import { SpaceBackground } from './components/SpaceBackground';
import { AccessRestrictedModal } from './components/AccessRestrictedModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { adminSignOut, getAdminSession, AdminSession } from './lib/supabase';
import { Plan } from './data/plans';

type Page = 'home' | 'minecraft' | 'discord' | 'store' | 'status' | 'knowledgebase' | 'client' | 'support' | 'contact' | 'about' | 'terms' | 'privacy' | 'refund' | 'aup' | 'panel' | 'admin';

const VALID_PAGES: Page[] = [
  'home','minecraft','discord','store','status','knowledgebase','client',
  'support','contact','about','terms','privacy','refund','aup','panel','admin',
];

function pageFromHash(): Page {
  const h = (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#\/?/, '').trim();
  return (VALID_PAGES as string[]).includes(h) ? (h as Page) : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(pageFromHash);
  const [userHasService, setUserHasService] = useState<boolean>(false);
  const [activeServices, setActiveServices] = useState<any[]>([]);
  const [currency, setCurrency] = useState<'INR' | 'USD'>(() => {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem('rc.currency') : null;
    return v === 'USD' || v === 'INR' ? v : 'INR';
  });
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  // Modal States
  const [isRestrictedOpen, setIsRestrictedOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Sync page ↔ URL hash (survives refresh, respects back/forward)
  useEffect(() => {
    const target = `#/${currentPage}`;
    if (window.location.hash !== target) window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const onHash = () => setCurrentPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('rc.currency', currency); } catch {}
  }, [currency]);

  // Restore an existing Supabase admin session on load
  useEffect(() => {
    getAdminSession().then((s) => {
      if (s) setAdminSession(s);
    });
  }, []);

  const handlePurchaseTrigger = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (plan: Plan) => {
    setUserHasService(true);
    setActiveServices((prev) => [
      {
        name: `${plan.name} Node Service`,
        plan: `${plan.ram} • ${plan.storage}`,
        status: 'active',
        ip: `${plan.name.toLowerCase().replace(/\s+/g, '-')}.rangecloud.gg:25565`,
        icon: plan.category === 'minecraft' ? '⛏️' : plan.category === 'discord' ? '🤖' : '🖥️',
      },
      ...prev,
    ]);
  };

  const navigate = (page: Page) => {
    if (page === 'client' && !userHasService) {
      setIsRestrictedOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} currency={currency} onPurchase={handlePurchaseTrigger} />;
      case 'minecraft': return <MinecraftPage navigate={navigate} currency={currency} onPurchase={handlePurchaseTrigger} />;
      case 'discord': return <DiscordBotPage navigate={navigate} currency={currency} onPurchase={handlePurchaseTrigger} />;
      case 'store': return <StorePage navigate={navigate} currency={currency} onPurchase={handlePurchaseTrigger} />;
      case 'status': return <StatusPage />;
      case 'knowledgebase': return <KnowledgebasePage />;
      case 'client': return <ClientAreaPage services={activeServices} />;
      case 'support': return <SupportPage />;
      case 'contact': return <ContactPage />;
      case 'about': return <AboutPage />;
      case 'terms': return <LegalPage type="terms" />;
      case 'privacy': return <LegalPage type="privacy" />;
      case 'refund': return <LegalPage type="refund" />;
      case 'aup': return <LegalPage type="aup" />;
      case 'panel': return <PanelPreviewPage />;
      default: return <HomePage navigate={navigate} currency={currency} onPurchase={handlePurchaseTrigger} />;
    }
  };

  // ── Admin area renders standalone (no public navbar / footer) ──
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-dark text-white relative overflow-x-hidden">
        <SpaceBackground />
        <div className="relative z-10">
          {adminSession ? (
            <AdminDashboardPage
              session={adminSession}
              onLogout={async () => {
                await adminSignOut();
                setAdminSession(null);
                setCurrentPage('home');
              }}
            />
          ) : (
            <>
              <button
                onClick={() => setCurrentPage('home')}
                className="fixed top-5 left-5 z-40 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/50 glass hover:text-white transition-colors"
              >
                ← Back to site
              </button>
              <AdminLoginPage onLogin={(s) => setAdminSession(s)} />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white grid-overlay relative overflow-x-hidden">
      {/* Animated space scene: stars, nebulas, meteors, asteroids */}
      <SpaceBackground />

      {/* Currency Switcher (mobile friendly) */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-40 flex items-center gap-1.5 glass px-2.5 py-1.5 rounded-full border-primary/20 neon-glow">
        <span className="hidden sm:inline text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Currency:</span>
        <button
          onClick={() => setCurrency('INR')}
          aria-label="Switch to Indian Rupees"
          className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${currency === 'INR' ? 'btn-primary text-white' : 'text-white/50 hover:text-white'}`}
        >
          ₹ INR
        </button>
        <button
          onClick={() => setCurrency('USD')}
          aria-label="Switch to US Dollars"
          className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${currency === 'USD' ? 'btn-primary text-white' : 'text-white/50 hover:text-white'}`}
        >
          $ USD
        </button>
      </div>

      <Navbar navigate={navigate} currentPage={currentPage} />

      <main className="relative z-10">
        {renderPage()}
      </main>

      <Footer navigate={navigate} />

      <ScrollTopButton />

      <AccessRestrictedModal
        isOpen={isRestrictedOpen}
        onClose={() => setIsRestrictedOpen(false)}
        onViewPlans={() => {
          setIsRestrictedOpen(false);
          setCurrentPage('minecraft');
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        plan={selectedPlan}
        currency={currency}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        onGoToPanel={() => {
          setIsCheckoutOpen(false);
          setCurrentPage('client');
        }}
      />
    </div>
  );
}
