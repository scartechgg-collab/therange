import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '../components/Section';

export function PanelPreviewPage() {
  const [activeTab, setActiveTab] = useState('console');

  const tabs = [
    { id: 'console', label: 'Console', icon: '💻' },
    { id: 'files', label: 'File Manager', icon: '📁' },
    { id: 'resources', label: 'Resources', icon: '📊' },
    { id: 'backups', label: 'Backups', icon: '💾' },
  ];

  const consoleLines = [
    { time: '12:00:01', text: '[Server] Starting Minecraft server version 1.21.4', type: 'info' },
    { time: '12:00:02', text: '[Server] Loading properties', type: 'info' },
    { time: '12:00:02', text: '[Server] Default game type: SURVIVAL', type: 'info' },
    { time: '12:00:03', text: '[Server] Preparing level "world"', type: 'info' },
    { time: '12:00:05', text: '[Server] Preparing start region for dimension minecraft:overworld', type: 'info' },
    { time: '12:00:08', text: '[Server] Time elapsed: 7213 ms', type: 'info' },
    { time: '12:00:08', text: '[Server] Done (7.213s)! For help, type "help"', type: 'success' },
    { time: '12:00:15', text: '[Server] Alex joined the game', type: 'info' },
    { time: '12:01:02', text: '[Server] Server is running at 20.0 TPS', type: 'success' },
    { time: '12:02:30', text: '[Server] Saving chunks for level \'ServerLevel[world]\'', type: 'info' },
  ];

  const files = [
    { name: 'server.properties', size: '1.2 KB', type: 'file', modified: 'Jan 15, 2026' },
    { name: 'plugins/', size: '—', type: 'folder', modified: 'Jan 14, 2026' },
    { name: 'world/', size: '—', type: 'folder', modified: 'Jan 15, 2026' },
    { name: 'logs/', size: '—', type: 'folder', modified: 'Jan 15, 2026' },
    { name: 'paper.yml', size: '3.4 KB', type: 'file', modified: 'Jan 12, 2026' },
    { name: 'bukkit.yml', size: '1.8 KB', type: 'file', modified: 'Jan 12, 2026' },
    { name: 'spigot.yml', size: '2.1 KB', type: 'file', modified: 'Jan 12, 2026' },
    { name: 'server.jar', size: '42.3 MB', type: 'file', modified: 'Jan 10, 2026' },
  ];

  const backups = [
    { name: 'Backup - Jan 15, 2026 12:00', size: '256 MB', status: 'completed' },
    { name: 'Backup - Jan 14, 2026 12:00', size: '254 MB', status: 'completed' },
    { name: 'Backup - Jan 13, 2026 12:00', size: '251 MB', status: 'completed' },
    { name: 'Backup - Jan 12, 2026 12:00', size: '248 MB', status: 'completed' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-5xl mb-4 block">🎛️</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Control <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Panel</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Powered by Pterodactyl — the industry-leading open-source game server management panel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Panel Preview */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="solid-card rounded-3xl overflow-hidden neon-glow">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-white/40 font-mono">panel.rangecloud.gg — SurvivalCraft Server</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full status-online" />
                <span className="text-xs text-green-400 font-medium">ONLINE</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-3 border-b border-white/5 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary bg-primary/10 border-b-2 border-primary'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px]">
              {activeTab === 'console' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-black/50 rounded-xl p-4 font-mono text-xs space-y-1 h-72 overflow-y-auto mb-4">
                    {consoleLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex gap-3 ${
                          line.type === 'success' ? 'text-green-400' :
                          line.type === 'error' ? 'text-red-400' :
                          'text-white/60'
                        }`}
                      >
                        <span className="text-white/20">[{line.time}]</span>
                        <span>{line.text}</span>
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-primary">❯</span>
                      <span className="animate-pulse text-white/40">_</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a command..."
                      className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-primary/50"
                    />
                    <button className="btn-primary px-4 py-2.5 rounded-lg text-sm font-medium">Send</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'files' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2 mb-4 text-sm text-white/40">
                    <span className="text-primary">/home/container</span>
                  </div>
                  <div className="space-y-1">
                    {files.map((file, i) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{file.type === 'folder' ? '📁' : '📄'}</span>
                          <span className="text-sm text-white group-hover:text-primary transition-colors">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-white/30">
                          <span className="hidden sm:inline">{file.modified}</span>
                          <span className="w-16 text-right">{file.size}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {[
                    { label: 'CPU Usage', value: 23, max: '400%', color: 'from-primary to-accent' },
                    { label: 'Memory Usage', value: 62, max: '8 GB', color: 'from-green-400 to-green-600' },
                    { label: 'Disk Usage', value: 34, max: '50 GB', color: 'from-yellow-400 to-orange-500' },
                    { label: 'Network (In)', value: 15, max: '100 Mbps', color: 'from-purple-400 to-purple-600' },
                  ].map((resource, i) => (
                    <div key={resource.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{resource.label}</span>
                        <span className="text-sm text-white/40">{resource.value}% of {resource.max}</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${resource.value}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full bg-gradient-to-r ${resource.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                      { label: 'Uptime', value: '14d 7h 23m' },
                      { label: 'Players', value: '12/50' },
                      { label: 'TPS', value: '20.0' },
                      { label: 'Version', value: 'Paper 1.21.4' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/40">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'backups' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-white">Server Backups (4/5 used)</h3>
                    <button className="btn-primary px-4 py-2 rounded-lg text-xs font-medium">Create Backup</button>
                  </div>
                  <div className="space-y-3">
                    {backups.map((backup, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between px-4 py-4 bg-white/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">💾</span>
                          <div>
                            <span className="text-sm font-medium text-white">{backup.name}</span>
                            <p className="text-xs text-white/30">{backup.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400">
                            {backup.status.toUpperCase()}
                          </span>
                          <button className="text-xs text-primary hover:underline">Download</button>
                          <button className="text-xs text-white/30 hover:text-red-400">Delete</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Panel Features */}
      <Section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="PANEL FEATURES" title="Full Control At Your Fingertips" subtitle="Everything you need to manage your server, in one beautiful interface." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💻', title: 'Live Console', desc: 'Real-time console with command history and auto-complete.' },
              { icon: '📁', title: 'File Manager', desc: 'Web-based file manager with code editor and drag-n-drop uploads.' },
              { icon: '📊', title: 'Resource Graphs', desc: 'Live CPU, memory, disk, and network usage monitoring.' },
              { icon: '💾', title: 'One-Click Backups', desc: 'Create, download, and restore backups with a single click.' },
              { icon: '⏰', title: 'Task Scheduler', desc: 'Schedule commands, restarts, and backups automatically.' },
              { icon: '👥', title: 'Sub-Users', desc: 'Invite team members with granular permission controls.' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 card-hover group"
              >
                <span className="text-3xl block mb-3">{feat.icon}</span>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{feat.title}</h3>
                <p className="text-xs text-white/40">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
