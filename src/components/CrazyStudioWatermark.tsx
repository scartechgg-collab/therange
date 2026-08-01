import { useState } from 'react';

/**
 * "Made by CrazyStudio" — premium minimal watermark.
 * Self-contained: no external CSS libraries, no dependencies.
 */
const LOGO_URL = 'https://i.postimg.cc/X7k6Yxs8/new-removebg-preview.png';

export function CrazyStudioWatermark() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <>
      <style>{`
        .cs-watermark {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          width: fit-content;
          max-width: 100%;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          -webkit-backdrop-filter: blur(12px) saturate(140%);
          backdrop-filter: blur(12px) saturate(140%);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.28);
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease,
                      background 0.25s ease, border-color 0.25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .cs-watermark:hover,
        .cs-watermark:focus-visible {
          transform: translateY(-2px) scale(1.03);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.42);
        }
        .cs-watermark:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.45);
          outline-offset: 3px;
        }
        .cs-watermark:active { transform: translateY(-1px) scale(1.01); }

        .cs-watermark__logo-wrap {
          width: 28px; height: 28px;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 7px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        }
        .cs-watermark__logo {
          width: 100%; height: 100%;
          object-fit: contain;
          display: block;
        }
        .cs-watermark__logo-fallback {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          color: #fff;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: -0.5px;
        }

        .cs-watermark__text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1.25;
          white-space: nowrap;
        }
        .cs-watermark__made {
          font-size: 12px; font-weight: 500;
          color: #B5B5B5; letter-spacing: 0.1px;
        }
        .cs-watermark__brand {
          font-size: 14px; font-weight: 600;
          color: #FFFFFF; letter-spacing: 0.1px;
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-watermark { transition: none; }
          .cs-watermark:hover, .cs-watermark:focus-visible { transform: none; }
        }
      `}</style>

      <a
        className="cs-watermark"
        href="http://www.crazystudio.fun/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Made by CrazyStudio — visit crazystudio.fun"
      >
        <span className="cs-watermark__logo-wrap">
          {imgFailed ? (
            <span className="cs-watermark__logo-fallback" aria-hidden="true">CS</span>
          ) : (
            <img
              className="cs-watermark__logo"
              src={LOGO_URL}
              alt="CrazyStudio Logo"
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              draggable={false}
              onError={() => setImgFailed(true)}
            />
          )}
        </span>
        <span className="cs-watermark__text">
          <span className="cs-watermark__made">Made by</span>
          <span className="cs-watermark__brand">CrazyStudio</span>
        </span>
      </a>
    </>
  );
}
