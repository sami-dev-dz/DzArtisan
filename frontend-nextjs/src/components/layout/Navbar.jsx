"use client";

import { useState, useEffect, useRef } from "react";
import { Hammer, Menu, X, Sun, Moon, Globe, ChevronDown, ChevronRight, User, LogOut } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const artisanConfirmed = user?.type !== "artisan" || user?.artisan?.statutValidation === "valide";

  const NAV_LINKS = [];

  const LANGS = [
    { code: "fr", label: "Français", short: "FR" },
    { code: "ar", label: "العربية", short: "AR" },
    { code: "en", label: "English", short: "EN" },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ui-state", JSON.stringify({ theme: "dark" }));
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ui-state", JSON.stringify({ theme: "light" }));
    }
  }, [theme]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isDark = theme === "dark";

  const changeLocale = (code) => {
    router.replace(pathname, { locale: code });
    setLangOpen(false);
  };

  const dashboardUrl = user?.type === 'admin' ? '/dashboard/admin' :
                      user?.type === 'artisan' ? '/dashboard/artisan' :
                      '/dashboard/client';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        :root {
          --nav-bg: #f8fafc;
          --nav-border: rgba(0,0,0,0.07);
          --nav-text: rgba(15,23,42,0.55);
          --nav-text-active: #0f172a;
          --nav-accent: #2563eb;
          --nav-surface: rgba(0,0,0,0.03);
          --nav-surface-hover: rgba(0,0,0,0.06);
          --nav-btn-bg: #f1f5f9;
          --nav-btn-border: rgba(0,0,0,0.08);
        }
        
        html.dark {
          --nav-bg: #07090f;
          --nav-border: rgba(255,255,255,0.06);
          --nav-text: rgba(255,255,255,0.55);
          --nav-text-active: #ffffff;
          --nav-accent: #3b82f6;
          --nav-surface: rgba(255,255,255,0.04);
          --nav-surface-hover: rgba(255,255,255,0.08);
          --nav-btn-bg: #1e293b;
          --nav-btn-border: rgba(255,255,255,0.08);
        }
        
        .dza-nav-font {
          font-family: 'Outfit', sans-serif;
        }

        .nav-link {
          position: relative;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: var(--nav-text);
          text-decoration: none;
          transition: color 0.2s;
          padding: 0.25rem 0;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 1.5px;
          background: var(--nav-accent);
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
          border-radius: 99px;
        }
        .nav-link:hover {
          color: var(--nav-text-active);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--nav-surface);
          border: 1px solid var(--nav-btn-border);
          color: var(--nav-text);
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
        }
        .icon-btn:hover {
          background: var(--nav-surface-hover);
          color: var(--nav-text-active);
          transform: translateY(-1px);
        }
        .icon-btn:active {
          transform: scale(0.95);
        }
        .lang-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 10px;
          height: 36px;
          border-radius: 10px;
          background: var(--nav-surface);
          border: 1px solid var(--nav-btn-border);
          color: var(--nav-text);
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          user-select: none;
        }
        .lang-pill:hover {
          background: var(--nav-surface-hover);
          color: var(--nav-text-active);
          transform: translateY(-1px);
        }
        .lang-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 140px;
          background: var(--nav-bg);
          border: 1px solid var(--nav-border);
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
          overflow: hidden;
          z-index: 10;
        }
        .lang-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--nav-text);
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: left;
          transition: background 0.15s, color 0.15s;
        }
        .lang-option:hover {
          background: var(--nav-surface-hover);
          color: var(--nav-text-active);
        }
        .lang-option.active {
          color: var(--nav-accent);
          font-weight: 600;
        }
        .btn-ghost {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--nav-text);
          padding: 0 4px;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
        }
        .btn-ghost:hover {
          color: var(--nav-text-active);
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 18px;
          height: 36px;
          border-radius: 10px;
          background: var(--nav-accent);
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(59,130,246,0.35);
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(59,130,246,0.5);
        }
        .btn-primary:active {
          transform: scale(0.97);
        }
        .divider {
          width: 1px;
          height: 20px;
          background: var(--nav-border);
          flex-shrink: 0;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--nav-text-active);
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid var(--nav-border);
          transition: color 0.2s;
        }
        .mobile-link:hover {
          color: var(--nav-accent);
        }
        .mobile-link:last-of-type {
          border-bottom: none;
        }
      `}</style>

      <nav
        className="dza-nav-font"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          padding: scrolled ? "12px 0" : "20px 0",
          background: scrolled ? "var(--nav-bg)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* ─── Logo ─── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                flexShrink: 0,
              }}
            >
              <Hammer size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: "1.0625rem",
                fontWeight: 800,
                color: "var(--nav-text-active)",
                letterSpacing: "-0.03em",
                fontFamily: "'Syne', sans-serif"
              }}
            >
              Dz<span style={{ color: "var(--nav-accent)" }}>Artisan</span>
            </span>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <div
            className="desktop-nav"
            style={{
              display: "none",
              alignItems: "center",
              gap: "32px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* ─── Desktop Controls ─── */}
          <div
            className="desktop-controls"
            style={{
              display: "none",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            {/* Theme toggle */}
            <button
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex" }}
                >
                  {isDark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Language switcher */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button
                className="lang-pill"
                aria-label="Change language"
                onClick={() => setLangOpen((o) => !o)}
              >
                <Globe size={13} strokeWidth={2} />
                {LANGS.find((l) => l.code === locale)?.short}
                <motion.span
                  animate={{ rotate: langOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex" }}
                >
                  <ChevronDown size={12} strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    className="lang-dropdown"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    {LANGS.map((langItem) => (
                      <button
                        key={langItem.code}
                        className={`lang-option ${locale === langItem.code ? "active" : ""}`}
                        onClick={() => changeLocale(langItem.code)}
                      >
                        {langItem.label}
                        {locale === langItem.code && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--nav-accent)",
                              display: "inline-block",
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="divider" />

            {/* Auth */}
            {user ? (
               <>
                 {artisanConfirmed && (
                   <Link href={dashboardUrl} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      {t("dashboard")}
                   </Link>
                 )}
                 <button onClick={logout} className="icon-btn" title={t("logout")}>
                   <LogOut size={14} />
                 </button>
               </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">
                  {t("login")}
                </Link>
                <Link href="/register" className="btn-primary">
                  {t("register")}
                  <ChevronRight size={13} strokeWidth={2.5} />
                </Link>
              </>
            )}
          </div>

          {/* ─── Mobile Right Controls ─── */}
          <div
            className="mobile-controls"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex" }}
                >
                  {isDark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              className="icon-btn"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((o) => !o)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? "x" : "menu"}
                  initial={{ opacity: 0, rotate: -15 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex" }}
                >
                  {isOpen ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ─── Mobile Dropdown ─── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{
                overflow: "hidden",
                background: "var(--nav-bg)",
                borderTop: "1px solid var(--nav-border)",
              }}
            >
              <div
                style={{
                  padding: "8px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Nav links */}
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="mobile-link"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                      <ChevronRight size={15} strokeWidth={2} style={{ color: "var(--nav-text)", opacity: 0.4 }} />
                    </Link>
                  </motion.div>
                ))}

                {/* Lang row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "20px",
                    marginBottom: "16px",
                  }}
                >
                  {LANGS.map((langItem) => (
                    <button
                      key={langItem.code}
                      onClick={() => changeLocale(langItem.code)}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: "10px",
                        border: `1px solid ${locale === langItem.code ? "var(--nav-accent)" : "var(--nav-border)"}`,
                        background: locale === langItem.code ? "rgba(59,130,246,0.12)" : "var(--nav-surface)",
                        color: locale === langItem.code ? "var(--nav-accent)" : "var(--nav-text)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {langItem.short}
                    </button>
                  ))}
                </motion.div>

                {/* Auth buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{ display: "flex", gap: "10px" }}
                >
                  {user ? (
                    <>
                      {artisanConfirmed && (
                        <Link
                          href={dashboardUrl}
                          onClick={() => setIsOpen(false)}
                          style={{
                            flex: 1,
                            padding: "13px",
                            borderRadius: "12px",
                            border: "1px solid var(--nav-border)",
                            background: "var(--nav-surface)",
                            color: "var(--nav-text-active)",
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            transition: "background 0.2s",
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                          }}
                        >
                           <User size={14} /> {t("dashboard")}
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        style={{
                          flex: artisanConfirmed ? 0.4 : 1,
                          padding: "13px",
                          borderRadius: "12px",
                          background: "var(--nav-surface)",
                          border: "1px solid var(--nav-border)",
                          color: "var(--nav-text-active)",
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <LogOut size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        style={{
                          flex: 1,
                          padding: "13px",
                          borderRadius: "12px",
                          border: "1px solid var(--nav-border)",
                          background: "var(--nav-surface)",
                          color: "var(--nav-text-active)",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        style={{
                          flex: 1,
                          padding: "13px",
                          borderRadius: "12px",
                          background: "var(--nav-accent)",
                          color: "#fff",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          textDecoration: "none",
                          boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                        }}
                      >
                        {t("register")}
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Responsive style injection ─── */}
        <style>{`
          @media (min-width: 768px) {
            .desktop-nav { display: flex !important; }
            .desktop-controls { display: flex !important; }
            .mobile-controls { display: none !important; }
          }
        `}</style>
      </nav>
    </>
  );
}
