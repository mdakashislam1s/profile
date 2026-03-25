"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#about");
  const navRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const sections = navItems
      .map((item) => ({ href: item.href, element: document.querySelector(item.href) as HTMLElement | null }))
      .filter((item) => item.element);

    if (!sections.length) return;

    let rafId = 0;

    const updateActive = () => {
      const scrollY = window.scrollY + 170;
      let next = sections[0].href;

      for (const section of sections) {
        if (!section.element) continue;
        if (scrollY >= section.element.offsetTop) {
          next = section.href;
        }
      }

      setActiveHref((current) => (current === next ? current : next));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => setOpen(false);

    window.addEventListener("hashchange", closeMenu);

    const media = window.matchMedia("(min-width: 768px)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    media.addEventListener("change", onMediaChange);

    return () => {
      window.removeEventListener("hashchange", closeMenu);
      media.removeEventListener("change", onMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link href="#home" className="text-lg font-semibold tracking-wide text-white">
          <span className="gold-text">Md. Akash</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? "page" : undefined}
              className={`relative text-sm font-medium transition-colors hover:text-gold-300 ${
                activeHref === item.href ? "nav-link-active" : "text-zinc-300"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gold-300 transition-all ${
                  activeHref === item.href ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-zinc-200 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-5 bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.nav
              id="mobile-menu"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full z-50 border-t border-white/10 bg-zinc-950/97 shadow-2xl shadow-black/60 md:hidden"
            >
              <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 px-4 py-4 sm:px-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={`rounded-xl px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-gold-300 ${
                      activeHref === item.href ? "bg-gold-500/10 text-gold-200" : "text-zinc-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
