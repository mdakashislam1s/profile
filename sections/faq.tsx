"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { faqs } from "@/lib/site";

export function FaqSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <Container id="faq" className="py-16 sm:py-20">
      <SectionHeading
        eyebrow="FAQ"
        title="Clear answers before we start"
        description="Everything you need to know about process, delivery, and growth expectations."
      />

      <div className="space-y-4">
        {faqs.map((item, index) => {
          const isOpen = active === index;

          return (
            <article key={item.question} className="rounded-2xl border border-white/10 bg-zinc-900/50">
              <button
                type="button"
                onClick={() => setActive(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-white">{item.question}</span>
                <span className="text-gold-300">{isOpen ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-300 sm:px-6">{item.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </Container>
  );
}
