import { useMemo } from 'react';

export function SpaceBackground() {
  // Stable random star field
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 5,
      })),
    []
  );

  // Stable asteroid configurations
  const asteroids = useMemo(
    () => [
      { size: 46, top: '8%', delay: 0, duration: 26 },
      { size: 28, top: '28%', delay: 7, duration: 32 },
      { size: 60, top: '55%', delay: 14, duration: 38 },
      { size: 22, top: '78%', delay: 21, duration: 24 },
    ],
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep space gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,82,255,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(0,168,255,0.06),transparent_50%)]" />

      {/* Twinkling stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.size > 1.8 ? '0 0 6px rgba(255,255,255,0.7)' : undefined,
          }}
        />
      ))}

      {/* Glowing nebulas */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[180px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-dark/12 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-accent/8 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '6s' }} />

      {/* Meteors (shooting stars) */}
      <div className="meteor" style={{ left: '85%', top: '4%', animationDelay: '0s', animationDuration: '7s' }} />
      <div className="meteor" style={{ left: '55%', top: '12%', animationDelay: '3s', animationDuration: '9s' }} />
      <div className="meteor" style={{ left: '95%', top: '35%', animationDelay: '6s', animationDuration: '8s' }} />
      <div className="meteor" style={{ left: '30%', top: '20%', animationDelay: '9s', animationDuration: '10s' }} />
      <div className="meteor" style={{ left: '70%', top: '60%', animationDelay: '12s', animationDuration: '7.5s' }} />

      {/* Drifting asteroids */}
      {asteroids.map((a, i) => (
        <div
          key={i}
          className="asteroid"
          style={{
            top: a.top,
            animationDelay: `${a.delay}s`,
            animationDuration: `${a.duration}s`,
          }}
        >
          <svg width={a.size} height={a.size} viewBox="0 0 64 64" fill="none">
            <defs>
              <radialGradient id={`rock-${i}`} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#6b7280" />
                <stop offset="55%" stopColor="#374151" />
                <stop offset="100%" stopColor="#111827" />
              </radialGradient>
            </defs>
            <path
              d="M32 4 L48 10 L60 26 L56 44 L40 60 L20 58 L6 42 L8 20 L20 8 Z"
              fill={`url(#rock-${i})`}
              stroke="rgba(0,168,255,0.25)"
              strokeWidth="1"
            />
            <circle cx="24" cy="22" r="5" fill="rgba(0,0,0,0.35)" />
            <circle cx="40" cy="36" r="7" fill="rgba(0,0,0,0.3)" />
            <circle cx="22" cy="44" r="3.5" fill="rgba(0,0,0,0.4)" />
            <path d="M32 4 L48 10 L44 16 L30 10 Z" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
