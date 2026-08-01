import { motion, AnimatePresence } from 'framer-motion';

interface AccessRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPlans: () => void;
}

export function AccessRestrictedModal({ isOpen, onClose, onViewPlans }: AccessRestrictedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md solid-card rounded-3xl p-6 sm:p-8 overflow-hidden neon-glow-strong z-10"
          >
            {/* Cosmic background glow */}
            <div className="absolute -top-12 -left-12 w-40 h-44 bg-red-500/10 rounded-full blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-40 h-44 bg-primary/15 rounded-full blur-[50px] pointer-events-none" />

            <div className="text-center">
              {/* Restricted icon */}
              <div className="w-16 h-14 mx-auto mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-red-500/10 animate-bounce">
                🔒
              </div>

              <h3 className="text-2xl font-black text-white mb-3 tracking-wide">
                Access Restricted
              </h3>
              
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                You need to purchase a service first before accessing the Panel.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onViewPlans}
                  className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold text-white tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  View Plans
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl text-xs font-semibold text-white/40 hover:text-white/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
