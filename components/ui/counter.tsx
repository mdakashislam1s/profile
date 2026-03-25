"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  suffix?: string;
};

export function Counter({ value, suffix = "" }: CounterProps) {
  const [display, setDisplay] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const controls = animate(0, value, {
          duration: 1.4,
          ease: "easeOut",
          onUpdate: (latest) => setDisplay(Math.round(latest)),
        });

        observer.disconnect();

        return () => controls.stop();
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={elementRef} className="gold-text text-4xl font-black tracking-tight sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}
