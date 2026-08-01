import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLiveTable } from '../hooks/useLiveTable';

interface KbCat { id: string; slug: string; title: string; icon: string; sort_order: number; }
interface Article { id: string; category_id: string | null; title: string; slug: string; views: number; published: boolean; }

export function KnowledgebasePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const cats     = useLiveTable<KbCat>('kb_categories', { orderBy: 'sort_order', ascending: true });
  const articles = useLiveTable<Article>('kb_articles', { orderBy: 'sort_order', ascending: true });

  const catById = new Map(cats.rows.map((c) => [c.id, c]));

  const published = articles.rows.filter((a) => a.published);
  const filtered = published.filter((a) => {
    const cat = a.category_id ? catById.get(a.category_id) : null;
    const matchCat = activeCategory === 'all' || cat?.slug === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">📖</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Knowledgebase</h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">Find guides, tutorials and answers to common questions.</p>

            <div className="relative max-w-xl mx-auto">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full solid-card rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </motion.div>

          <div className="flex gap-2 flex-wrap justify-center mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === 'all' ? 'btn-primary text-white' : 'solid-card text-white/50 hover:text-white'
              }`}
            >
              All
            </button>
            {cats.rows.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.slug ? 'btn-primary text-white' : 'solid-card text-white/50 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.title}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((article, i) => {
              const cat = article.category_id ? catById.get(article.category_id) : null;
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="solid-card rounded-xl p-5 flex items-center justify-between card-hover cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{cat?.icon || '📄'}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{article.title}</h3>
                      <span className="text-xs text-white/30">{cat?.title || 'Uncategorised'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/20 hidden sm:inline">{article.views.toLocaleString()} views</span>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <span className="text-4xl block mb-4">🔍</span>
                <p className="text-white/40">
                  {articles.loading ? 'Loading articles…' : published.length === 0 ? 'No articles have been published yet.' : 'No articles match your search.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
