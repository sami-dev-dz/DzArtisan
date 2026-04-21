"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserPlus, FileText, MessageSquare, Star,
  Search, ArrowRight, Sparkles,
} from "lucide-react"

/* ─────────────────────────────────────────────
   Step definitions — icons + colors kept as-is
───────────────────────────────────────────────*/
const CLIENT_STEPS = [
  { icon: UserPlus,      color: "#3b82f6", glow: "rgba(59,130,246,0.15)"  },
  { icon: FileText,      color: "#10b981", glow: "rgba(16,185,129,0.15)"  },
  { icon: MessageSquare, color: "#f59e0b", glow: "rgba(245,158,11,0.15)"  },
  { icon: Star,          color: "#8b5cf6", glow: "rgba(139,92,246,0.15)"  },
]
const DIRECT_STEPS = [
  { icon: UserPlus, color: "#3b82f6", glow: "rgba(59,130,246,0.15)" },
  { icon: Search,   color: "#06b6d4", glow: "rgba(6,182,212,0.15)"  },
  { icon: Star,     color: "#8b5cf6", glow: "rgba(139,92,246,0.15)" },
]

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────────*/
const tabContent = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08 } },
  exit:   { opacity: 0, transition: { duration: 0.15 } },
}
const stepCard = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────
   Step Card
───────────────────────────────────────────────*/
function StepCard({
  step,
  index,
  total,
  text,
}) {
  const Icon = step.icon
  const isLast = index === total - 1

  return (
    <motion.div
      variants={stepCard}
      style={{ position: "relative", flex: 1, minWidth: 0 }}
    >
      {/* Desktop connector line */}
      {!isLast && (
        <div
          className="hiw-connector"
          style={{
            position: "absolute",
            top: 40,
            left: "calc(50% + 40px)",
            right: "calc(-50% + 40px)",
            height: 1,
            background: `linear-gradient(to right, ${step.color}50, transparent)`,
            zIndex: 0,
            display: "none",
          }}
        />
      )}

      <div
        className="hiw-card"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "32px 26px 28px",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: 16,
          height: "100%",
          transition: "border-color 0.25s, transform 0.3s, box-shadow 0.3s",
          cursor: "default",
          overflow: "hidden",
        }}
      >
        {/* Top color bar per step */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(to right, ${step.color}, ${step.color}00)`,
          borderRadius: "16px 16px 0 0",
          opacity: 0.6,
        }} />

        {/* Step number */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: step.color,
          marginBottom: 20,
          fontFamily: "var(--font-sans)",
          opacity: 0.85,
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Icon */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: step.glow,
          border: `1.5px solid ${step.color}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
          flexShrink: 0,
        }}>
          <Icon size={23} color={step.color} strokeWidth={1.7} />
        </div>

        {/* Title */}
        <div style={{
          fontSize: 15.5,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.3,
          marginBottom: 10,
          fontFamily: "var(--font-sans)",
          letterSpacing: "-0.015em",
        }}>
          {text?.title ?? "—"}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 13.5,
          lineHeight: 1.75,
          color: "var(--text-muted)",
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
        }}>
          {text?.desc ?? "—"}
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────*/
export function HowItWorks() {
  const t = useTranslations("how_it_works")
  const locale = useLocale()
  const isRTL = locale === "ar"

  const [activeTab, setActiveTab] = React.useState("client")

  const steps = activeTab === "client" ? CLIENT_STEPS : DIRECT_STEPS
  const rawSteps =
    activeTab === "client"
      ? (t.raw("client_steps") ?? [])
      : (t.raw("direct_steps") ?? [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700;800&display=swap');

        .hiw-root {
          --card-bg:        rgba(255,255,255,0.92);
          --card-border:    rgba(15,23,42,0.08);
          --text-primary:   #0c1428;
          --text-secondary: #3d5080;
          --text-muted:     #6b7fa6;
          --section-bg:     #ffffff;
          --toggle-bg:      rgba(15,23,42,0.04);
          --toggle-border:  rgba(15,23,42,0.10);
          --font-serif:     'Instrument Serif', Georgia, serif;
          --font-sans:      'Geist', system-ui, sans-serif;
        }

        html.dark .hiw-root {
          --card-bg:        rgba(255,255,255,0.03);
          --card-border:    rgba(255,255,255,0.08);
          --text-primary:   #eef2ff;
          --text-secondary: #8da0c4;
          --text-muted:     #556080;
          --section-bg:     #0f172a;
          --toggle-bg:      rgba(255,255,255,0.04);
          --toggle-border:  rgba(255,255,255,0.09);
        }

        .hiw-card:hover {
          border-color: rgba(255,255,255,0.16) !important;
          transform: translateY(-5px);
          box-shadow: 0 24px 52px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15);
        }
        html.light-mode .hiw-card:hover {
          border-color: rgba(15,23,42,0.13) !important;
          box-shadow: 0 20px 44px rgba(15,23,42,0.12);
        }

        @media (min-width: 1024px) {
          .hiw-connector { display: block !important; }
        }

        .hiw-tab {
          position: relative;
          padding: 11px 30px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 11px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          transition: color 0.2s;
          min-width: 148px;
          z-index: 1;
        }

        .hiw-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 640px) {
          .hiw-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .hiw-grid {
            display: flex;
            gap: 18px;
          }
        }
      `}</style>

      <section
        className="hiw-root"
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          padding: "100px 0 110px",
          background: "var(--section-bg)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Atmospheric gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 65% 45% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Subtle grid texture */}
        <svg
          width="100%" height="100%"
          style={{ position: "absolute", inset: 0, opacity: 0.018, pointerEvents: "none" }}
          aria-hidden
        >
          <defs>
            <pattern id="hiw-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hiw-grid)" />
        </svg>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#60a5fa",
                padding: "6px 14px",
                borderRadius: 99,
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
                marginBottom: 24,
              }}
            >
              <Sparkles size={11} strokeWidth={2} />
              {t("section_label") ?? "Processus"}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                margin: "0 0 16px",
              }}
            >
              {t("title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                maxWidth: 460,
                margin: "0 auto",
                fontWeight: 400,
              }}
            >
              {t("subtitle")}
            </motion.p>
          </div>

          {/* ── Tab toggle ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22, duration: 0.5 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 52 }}
          >
            <div style={{
              display: "inline-flex",
              padding: 5,
              background: "var(--toggle-bg)",
              border: "1px solid var(--toggle-border)",
              borderRadius: 14,
              gap: 2,
              position: "relative",
            }}>
              {["client", "direct"].map((tab) => (
                <button
                  key={tab}
                  className="hiw-tab"
                  onClick={() => setActiveTab(tab)}
                  style={{ color: activeTab === tab ? "#fff" : "var(--text-muted)" }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="hiw-pill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                        borderRadius: 11,
                        boxShadow: "0 4px 18px rgba(37,99,235,0.38)",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  {tab === "client" ? t("tab_client") : t("tab_direct")}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Steps grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="hiw-grid"
              variants={tabContent}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {steps.map((step, i) => (
                <StepCard
                  key={i}
                  step={step}
                  index={i}
                  total={steps.length}
                  text={rawSteps[i]}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Recommended note — client only ── */}
          <AnimatePresence>
            {activeTab === "client" && (
              <motion.div
                key="rec"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ delay: 0.32, duration: 0.4 }}
                style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
              >
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 22px",
                  background: "rgba(59,130,246,0.07)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  borderRadius: 12,
                }}>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#fff",
                    background: "#2563eb",
                    padding: "3px 9px",
                    borderRadius: 5,
                    fontFamily: "var(--font-sans)",
                  }}>
                    {t("recommended_label") ?? "Recommandé"}
                  </div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#93c5fd",
                    fontFamily: "var(--font-sans)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    {t("recommended_desc") ?? "Le moyen le plus rapide d'obtenir des devis précis."}
                    <ArrowRight size={13} strokeWidth={2} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </>
  )
}