"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AssistantWidget } from "@/components/assistant-widget";
import { siteConfig } from "@/lib/site";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const updateVisibility = () => {
      const next = window.scrollY > 420;
      setShow((current) => (current === next ? current : next));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
    <AnimatePresence>
      {show ? (
        <>
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2 sm:bottom-8 sm:left-8"
          >
            <button
              type="button"
              onClick={() => setAiOpen((value) => !value)}
              className={`floating-icon-btn ${aiOpen ? "floating-icon-btn-gold" : ""}`}
              aria-label="Toggle AI Assistant"
              aria-expanded={aiOpen}
              title="AI Assistant"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M12 2 14.6 8.1 21 10.6 14.6 13.1 12 19.2 9.4 13.1 3 10.6 9.4 8.1 12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {aiOpen ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="assistant-widget-wrap"
                >
                  <AssistantWidget onClose={() => setAiOpen(false)} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.aside>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-4 z-40 flex flex-col gap-2 sm:bottom-8 sm:right-8"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="floating-icon-btn floating-icon-btn-gold"
              aria-label="Chat on WhatsApp"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.55 0 .25 5.3.25 11.81c0 2.08.54 4.11 1.57 5.9L0 24l6.47-1.7a11.79 11.79 0 0 0 5.59 1.42h.01c6.5 0 11.8-5.29 11.8-11.8 0-3.15-1.23-6.1-3.35-8.44Zm-8.46 18.2h-.01a9.84 9.84 0 0 1-5-1.37l-.36-.21-3.84 1.01 1.03-3.75-.24-.38a9.83 9.83 0 0 1-1.5-5.2c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.11 1.03 6.98 2.9a9.8 9.8 0 0 1 2.88 6.96c0 5.43-4.42 9.85-9.84 9.85Zm5.4-7.38c-.3-.15-1.8-.88-2.08-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.93 1.19-.17.2-.34.23-.64.08a8.07 8.07 0 0 1-2.37-1.46 8.89 8.89 0 0 1-1.64-2.04c-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.66-1.6-.9-2.2-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.5.08-.75.38-.25.3-.98.95-.98 2.32 0 1.37 1 2.7 1.14 2.88.15.2 1.97 3.02 4.78 4.23.67.3 1.2.46 1.6.6.67.2 1.28.17 1.76.1.54-.08 1.8-.74 2.05-1.45.25-.72.25-1.33.17-1.45-.08-.12-.27-.2-.57-.35Z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="floating-icon-btn"
              aria-label="Back to top"
              title="Back to Top"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M12 19V6M6 12l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
