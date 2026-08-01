import { useState } from 'react';
import { motion } from 'framer-motion';
import { Page } from '../types';
import { Plan } from '../data/plans';
import { usePlans } from '../hooks/usePlans';

interface StorePageProps {
  navigate: (page: Page) => void;
  currency: 'INR' | 'USD';
  onPurchase: (plan: Plan) => void;
}

export function StorePage({ currency, onPurchase }: StorePageProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { plans: allPlans } = usePlans();

  const symbol = currency === 'INR' ? '₹' : '$';

  const categories = [
    { key: 'all', label: 'All Deployments' },
    { key: 'minecraft', label: 'Minecraft Nodes' },
    { key: 'discord', label: 'Discord Bot' },
    { key: 'vps', label: 'VPS Servers' },
  ];

  const filteredProducts = allPlans.filter((p) => {
    const matchesFilter = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.subCategory && p.subCategory.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">🛒</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
              Galactic <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent neon-text">Store</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">Browse our product coordinates and select the perfect configuration.</p>
          </motion.div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plan configuration..."
                className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors font-semibold"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`px-4 py-3 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap ${
                    filter === cat.key ? 'btn-primary text-white' : 'glass text-white/50 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`solid-card rounded-2xl p-5 sm:p-6 card-hover relative flex flex-col justify-between overflow-hidden ${
                  product.popular ? 'gradient-border' : ''
                }`}
              >
                {product.popular && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest bg-primary/20 text-primary">POPULAR</span>
                )}
                
                <div>
                  <span className="text-sm font-bold text-accent uppercase tracking-widest">{product.category} deployment</span>
                  <h3 className="text-xl font-black text-white mt-1 mb-1">{product.name}</h3>
                  {product.subCategory && <p className="text-xs text-white/30 mb-4">{product.subCategory}</p>}

                  <div className="space-y-2.5 mb-6 text-xs text-white/60">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>RAM</span>
                      <span className="font-bold text-white/80">{product.ram}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Storage</span>
                      <span className="font-bold text-white/80">{product.storage}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>CPU</span>
                      <span className="font-bold text-white/80">{product.cpu}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <span className="text-2xl font-black text-white">
                    {symbol}{product.price[currency]}
                    <span className="text-xs font-normal text-white/40">/mo</span>
                  </span>
                  <button
                    onClick={() => onPurchase(product)}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white"
                  >
                    Deploy
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <span className="text-4xl block mb-4">🔍</span>
              <p className="text-white/40 font-semibold">No deployment configs matched your query coordinates.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
