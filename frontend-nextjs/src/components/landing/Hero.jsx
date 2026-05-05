"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import {
  Search, ArrowRight,
  ShieldCheck, Clock, CheckCircle2,
  Zap, Droplets, Hammer, Wrench, Paintbrush, Truck,
} from "lucide-react"
import { Link } from "@/i18n/routing"

/* ─────────────────────────────────────────────
   Animation helpers
───────────────────────────────────────────────*/
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const rise = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────
   Trust items
───────────────────────────────────────────────*/
const TRUST_KEYS = [
  { icon: ShieldCheck,  key: "trust_verified" },
  { icon: Clock,        key: "trust_fast"     },
  { icon: CheckCircle2, key: "trust_secure"   },
]

/* ─────────────────────────────────────────────
   Trade icons for the orbiting ring
───────────────────────────────────────────────*/
const TRADES = [
  { icon: Zap, color: "#f59e0b", key: "electric" },
  { icon: Droplets, color: "#3b82f6", key: "plumbing" },
  { icon: Hammer, color: "#ef4444", key: "masonry" },
  { icon: Wrench, color: "#10b981", key: "mechanics" },
  { icon: Paintbrush, color: "#8b5cf6", key: "painting" },
  { icon: Truck, color: "#f97316", key: "delivery" },
]

function TrustVisual() {
  const t = useTranslations("hero")
  const cx = 200
  const cy = 200
  const R = 140 // orbit radius

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", width: 400, height: 400 }}
    >
      <style>{`
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
      
      {/* SVG orbit scene */}
      <svg width="400" height="400" viewBox="0 0 400 400" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ring-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.18" />
          </radialGradient>
        </defs>

        {/* Outer glow */}
        <circle cx={cx} cy={cy} r={175} fill="url(#core-glow)" />

        {/* Orbit dashed ring */}
        <circle
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke="rgba(59,130,246,0.15)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Inner ring */}
        <circle
          cx={cx} cy={cy} r={80}
          fill="none"
          stroke="rgba(59,130,246,0.08)"
          strokeWidth="1"
        />

        {/* The rotating group */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin-cw 40s linear infinite" }}>
          
          {/* Connecting spokes */}
          {TRADES.map((trade, i) => {
            const a = (i / TRADES.length) * 2 * Math.PI
            const x = cx + R * Math.cos(a)
            const y = cy + R * Math.sin(a)
            const ix = cx + 64 * Math.cos(a)
            const iy = cy + 64 * Math.sin(a)
            return (
              <line key={`spoke-${i}`}
                x1={ix} y1={iy} x2={x} y2={y}
                stroke={`${trade.color}20`}
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            )
          })}

          {/* Orbiting trade icons (counter-rotating to stay upright) */}
          {TRADES.map((trade, i) => {
            const a = (i / TRADES.length) * 2 * Math.PI
            const x = cx + R * Math.cos(a)
            const y = cy + R * Math.sin(a)
            const Icon = trade.icon
            return (
              <g key={`icon-${i}`} style={{ transformOrigin: `${x}px ${y}px`, animation: "spin-ccw 40s linear infinite" }}>
                <g transform={`translate(${x - 18}, ${y - 18})`}>
                  <rect width="36" height="36" rx="10"
                    fill={`${trade.color}18`}
                    stroke={`${trade.color}35`}
                    strokeWidth="1"
                  />
                  <foreignObject width="36" height="36">
                    <div xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        width: 36, height: 36,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      <Icon size={16} color={trade.color} strokeWidth={2} />
                    </div>
                  </foreignObject>
                </g>
              </g>
            )
          })}
        </g>
        
        {/* Center platform badge */}
        <circle cx={cx} cy={cy} r={64} fill="rgba(255,255,255,0.03)" stroke="rgba(59,130,246,0.18)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={52} fill="rgba(37,99,235,0.09)" />

        {/* Center checkmark icon */}
        <g transform={`translate(${cx - 22}, ${cy - 22})`}>
          <rect width="44" height="44" rx="13"
            fill="rgba(37,99,235,0.18)"
            stroke="rgba(59,130,246,0.35)"
            strokeWidth="1.5"
          />
          <foreignObject width="44" height="44">
            <div xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width: 44, height: 44,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <ShieldCheck size={22} color="#60a5fa" strokeWidth={1.8} />
            </div>
          </foreignObject>
        </g>
      </svg>

      {/* Floating label cards anchored to specific positions */}
      {[
        { key: "badge_verified", icon: ShieldCheck, color: "#3b82f6", x: -30, y: 30 },
        { key: "badge_fast",     icon: Clock,       color: "#10b981", x: 290, y: 30 },
        { key: "badge_no_commitment", icon: CheckCircle2, color: "#8b5cf6", x: 120, y: 340 },
      ].map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: 0.6 + i * 0.2, duration: 0.6 },
              y: { delay: 0.6 + i * 0.2, duration: 3.5 + i * 0.7, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              position: "absolute",
              left: card.x, top: card.y,
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 13px",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 12,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: `${card.color}15`,
              border: `1px solid ${card.color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={13} color={card.color} strokeWidth={2.2} />
            </div>
            <span style={{
              fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)", letterSpacing: "-0.01em",
            }}>
              {t(card.key)}
            </span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main Hero
───────────────────────────────────────────────*/
export function Hero() {
  const t = useTranslations("hero")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

        :root {
          --card-bg:        rgba(255, 255, 255, 0.9);
          --card-border:    rgba(0, 0, 0, 0.08);
          --text-primary:   #0f172a;
          --text-secondary: #475569;
          --text-muted:     #94a3b8;
          --hero-bg:        #ffffff;
          --accent:         #2563eb;
          --font-serif:     'Instrument Serif', Georgia, serif;
          --font-sans:      'Geist', system-ui, sans-serif;
          --grid-opacity:   0.04;
          --grid-color:     #000000;
        }

        html.dark {
          --card-bg:        rgba(15, 23, 42, 0.6);
          --card-border:    rgba(255, 255, 255, 0.08);
          --text-primary:   #f8fafc;
          --text-secondary: #94a3b8;
          --text-muted:     #475569;
          --hero-bg:        #0f172a;
          --grid-opacity:   0.04;
          --grid-color:     #ffffff;
        }

        .hero-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
          overflow: hidden;
          background: var(--hero-bg);
          font-family: var(--font-sans);
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: clamp(0.9rem, 1.6vw, 1.25rem); font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: #60a5fa;
          padding: 11px 20px; border-radius: 99px;
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.2);
          margin-bottom: 28px; font-family: var(--font-sans);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.04);
        }
        .hero-dot {
          width: 11px; height: 11px; border-radius: 50%;
          background: #3b82f6; position: relative; flex-shrink: 0;
        }
        .hero-dot::after {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          background: rgba(59,130,246,0.35);
          animation: hero-pulse 2s ease-in-out infinite;
        }
        @keyframes hero-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(1.7); opacity: 0; }
        }

        .hero-h1 {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 5.8vw, 5.25rem);
          font-weight: 400; line-height: 1.04;
          letter-spacing: -0.015em; color: var(--text-primary); margin: 0;
        }
        .hero-h1 em {
          font-style: italic;
          background: linear-gradient(118deg, #60a5fa 0%, #93c5fd 45%, #bfdbfe 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 28px rgba(96,165,250,0.3));
        }

        .hero-sub {
          font-size: 1.075rem; line-height: 1.82;
          color: var(--text-secondary); font-weight: 300;
          max-width: 500px; margin: 24px 0 46px;
          font-family: var(--font-sans);
        }

        .btn-fill {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 0 28px; height: 52px; border-radius: 14px;
          background: linear-gradient(140deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff; font-family: var(--font-sans);
          font-size: 14.5px; font-weight: 600; letter-spacing: -0.01em;
          text-decoration: none; border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(37,99,235,0.38), 0 1px 0 rgba(255,255,255,0.16) inset;
          position: relative; overflow: hidden;
        }
        .btn-fill::after {
          content: ''; position: absolute; top: 0; left: -100%; right: 100%; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent);
          transition: left 0.55s ease, right 0.55s ease;
        }
        .btn-fill:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(37,99,235,0.52), 0 1px 0 rgba(255,255,255,0.16) inset; }
        .btn-fill:hover::after { left: 100%; right: -100%; }
        .btn-fill:active { transform: scale(0.97); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 0 24px; height: 52px; border-radius: 14px;
          background: var(--card-bg); color: var(--text-secondary);
          font-family: var(--font-sans); font-size: 14.5px; font-weight: 500;
          letter-spacing: -0.01em; text-decoration: none;
          border: 1px solid var(--card-border); cursor: pointer;
          transition: color 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(12px);
        }
        .btn-outline:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.15); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }

        .trust-row  { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 0; margin-bottom: 42px; }
        .trust-item { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 500; color: var(--text-muted); padding: 0 18px 0 0; letter-spacing: -0.005em; }
        .trust-sep  { width: 1px; height: 14px; background: var(--card-border); margin-right: 18px; flex-shrink: 0; opacity: 0.7; }

        /* ── Trade pill strip ── */
        .trade-strip {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin: 36px 0 0;
        }
        .trade-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 99px;
          font-size: 12px; font-weight: 600;
          font-family: var(--font-sans); letter-spacing: -0.01em;
          border: 1px solid transparent;
          transition: transform 0.18s, box-shadow 0.18s;
          cursor: default;
        }
        .trade-pill:hover { transform: translateY(-1px); }

        .hero-inner {
          max-width: 1300px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; gap: 80px;
          width: 100%; position: relative; z-index: 1;
        }
        .hero-left  { flex: 1; min-width: 0; }
        .hero-right { flex: 0 0 400px; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1023px) {
          .hero-right { display: none; }
          .hero-sub   { max-width: 100%; }
        }

        .hero-mesh { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .blob { position: absolute; border-radius: 50%; filter: blur(100px); }
        .hero-grain {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 180px;
        }

        /* Scrolling marquee strip */
        .marquee-wrap {
          position: absolute; bottom: 0; left: 0; right: 0;
          overflow: hidden; padding: 20px 0;
          border-top: 1px solid var(--card-border);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(6px);
          z-index: 2;
        }
        .marquee-track {
          display: flex; gap: 48px; width: max-content;
        }
        .marquee-track.ltr {
          animation: marquee-scroll-ltr 28s linear infinite;
        }
        .marquee-track.rtl {
          animation: marquee-scroll-rtl 28s linear infinite;
        }
        .marquee-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500; color: var(--text-muted);
          font-family: var(--font-sans); white-space: nowrap;
        }
        @keyframes marquee-scroll-ltr {
          from { transform: translateX(-12.5%); }
          to   { transform: translateX(0); }
        }
        @keyframes marquee-scroll-rtl {
          from { transform: translateX(0); }
          to   { transform: translateX(-12.5%); }
        }
      `}</style>

      <section className="hero-root">
        {/* Background */}
        <div className="hero-mesh">
          <div className="blob" style={{ width: 800, height: 700, background: "radial-gradient(circle, rgba(29,78,216,0.11) 0%, transparent 70%)", top: "-20%", left: "-12%" }} />
          <div className="blob" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", bottom: "5%", right: "-5%" }} />
          <div className="blob" style={{ width: 600, height: 300, background: "radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 70%)", top: "30%", left: "35%" }} />
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: "var(--grid-opacity)" }}>
            <defs>
              <pattern id="hero-grid" width="52" height="52" patternUnits="userSpaceOnUse">
                <path d="M 52 0 L 0 0 0 52" fill="none" stroke="var(--grid-color)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>
        <div className="hero-grain" />

        <div className="hero-inner" dir={isRTL ? "rtl" : "ltr"}>

          {/* ── LEFT ── */}
          <motion.div className="hero-left" variants={stagger} initial="hidden" animate="show">
            <motion.div variants={rise}>
              <div className="hero-eyebrow">
                <span className="hero-dot" />
                {t("badge")}
              </div>
            </motion.div>

            <motion.h1 variants={rise} className="hero-h1">
              {t.rich("title", { accent: (chunks) => <em>{chunks}</em> })}
            </motion.h1>

            <motion.p variants={rise} className="hero-sub">
              {t("subtitle")}
            </motion.p>

            <motion.div variants={rise} style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <Link href="/artisans" className="btn-fill">
                <Search size={16} strokeWidth={2.4} />
                {t("cta_find")}
                <ArrowRight size={14} strokeWidth={2.4} style={isRTL ? { transform: "rotate(180deg)" } : {}} />
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div variants={rise} className="trust-row">
              {TRUST_KEYS.map((s, i, arr) => (
                <React.Fragment key={s.key}>
                  <div className="trust-item">
                    <s.icon size={13} color="#3b82f6" strokeWidth={2.4} />
                    {t(s.key)}
                  </div>
                  {i < arr.length - 1 && <div className="trust-sep" />}
                </React.Fragment>
              ))}
            </motion.div>


          </motion.div>

          {/* ── RIGHT — animated orbit ── */}
          <div className="hero-right">
            <TrustVisual />
          </div>

        </div>

        {/* Scrolling marquee at the bottom */}
        <div className="marquee-wrap" dir="ltr">
          <div className={`marquee-track ${isRTL ? "rtl" : "ltr"}`}>
            {[...Array(8)].map((_, copyIdx) =>
              TRADES.map((trade, i) => {
                const Icon = trade.icon
                const label = t(`trades.${trade.key}`)
                return (
                  <div className="marquee-item" key={`marquee-${copyIdx}-${trade.key}`} dir={isRTL ? "rtl" : "ltr"}>
                    <Icon size={13} color={trade.color} strokeWidth={2} />
                    <span>{label}</span>
                    <span style={{ color: "var(--card-border)", [isRTL ? 'marginRight' : 'marginLeft']: 16 }}>·</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>
    </>
  )
}