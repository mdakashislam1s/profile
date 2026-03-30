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
  { href: "#offers", label: "Offers" },
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
      .filter((item): item is { href: string; element: HTMLElement } => Boolean(item.element));

    if (!sections.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          const href = `#${id}`;
          ratios.set(href, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let next = sections[0].href;
        let maxRatio = 0;

        for (const item of navItems) {
          const ratio = ratios.get(item.href) ?? 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            next = item.href;
          }
        }

        if (maxRatio > 0) {
          setActiveHref((current) => (current === next ? current : next));
        }
      },
      { rootMargin: "-38% 0px -52% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );

    for (const section of sections) {
      observer.observe(section.element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setOpen(false);
      const hash = window.location.hash;
      if (hash && navItems.some((item) => item.href === hash)) {
        setActiveHref(hash);
      }
    };

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
    <header ref={navRef} className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 md:bg-zinc-950/72 md:backdrop-blur-xl">
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
              className={`relative text-[15px] font-semibold tracking-wide transition-colors hover:text-gold-300 ${
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
              className="absolute left-0 right-0 top-full z-50 border-t border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60 md:hidden"
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
