import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function HeroSection() {
  return (
    <Container id="home" className="relative overflow-hidden py-10 sm:py-12 lg:py-14">
      <div className="hero-glow pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full" />
      <div className="hero-glow pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full" />

      <div className="grid min-h-[calc(100vh-7rem)] items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className="space-y-8">
          <p className="inline-flex rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">
            Senior Web Developer + SEO Specialist
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.04] text-white sm:text-5xl lg:text-7xl">
            Advanced Websites Engineered for <span className="gold-text">Speed, SEO, and Conversions</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            I design and build premium digital experiences with modern frontend architecture, technical SEO precision, and high-converting user journeys.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#contact" className="gold-button">
              Contact Me
            </Link>
            <Link href="#portfolio" className="ghost-button">
              View Portfolio
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              "Lighthouse 90+ Focus",
              "SEO + Dev in One Partner",
              "24h Response Time",
            ].map((item) => (
              <p
                key={item}
                className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-zinc-300"
              >
                {item}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="space-y-4">
            <div className="premium-card shimmer-panel rounded-2xl p-4 sm:p-5">
              <div className="code-header mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="code-dot bg-[#ff5f56]" />
                  <span className="code-dot bg-[#ffbd2f]" />
                  <span className="code-dot bg-[#27c93f]" />
                </div>
                <span className="rounded-full border border-gold-300/30 bg-gold-500/10 px-2.5 py-1 text-[11px] text-gold-200">
                  app/production.tsx
                </span>
              </div>

              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-4 text-xs leading-relaxed text-zinc-200 sm:text-sm">
{`const website = {
  stack: ["Next.js", "TypeScript", "Tailwind"],
  seo: "technical + content + entity strategy",
  coreWebVitals: "pass",
  lighthouse: 96,
  goal: "rank + convert + scale"
};`}
              </pre>
            </div>

            <div className="premium-card rounded-2xl p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-semibold text-gold-300">Delivery Metrics</p>
                <span className="rounded-full border border-gold-300/30 bg-gold-500/10 px-3 py-1 text-xs text-gold-200">
                  Live Strategy
                </span>
              </div>
              <div className="space-y-4">
                {[
                  ["Performance Optimization", "96/100", "96%"],
                  ["Technical SEO Coverage", "A+", "92%"],
                  ["Conversion Architecture", "+46%", "78%"],
                ].map(([label, value, progress]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{label}</span>
                      <span className="font-semibold text-gold-300">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div className="gold-gradient h-full rounded-full" style={{ width: progress }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Framer Motion", "Technical SEO", "Core Web Vitals"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-gold-300/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <Image
            src="/code-snippet.svg"
            alt="Code and analytics interface"
            width={460}
            height={180}
            className="absolute -bottom-12 -left-10 hidden rounded-2xl border border-white/15 bg-zinc-900/70 p-2 shadow-2xl 2xl:block"
          />
        </Reveal>
      </div>
    </Container>
  );
}
