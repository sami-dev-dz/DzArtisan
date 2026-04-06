"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Check, Settings } from "lucide-react";

export const CookieConsent = () => {
  const t = useTranslations("cookie_consent");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dz_cookie_consent");
    if (!consent) {
      // Delay appearance for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("dz_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("dz_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-8 md:max-w-md"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full -mr-12 -mt-12 transition-all" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <Cookie className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {t("title")}
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {t("description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {t("accept_all")}
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {t("manage_preferences")}
                </button>
              </div>

              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
