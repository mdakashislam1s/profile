import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <Container id="home" className="relative overflow-hidden py-8 sm:py-10 lg:py-12">
      <div className="hero-glow pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full" />
      <div className="hero-glow pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full" />

      <div className="grid min-h-[82svh] items-center gap-8 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
        <div className="space-y-6 sm:space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/35 bg-gold-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
            SEO + Web Development Partner
          </div>

          <div className="space-y-3.5">
            <h1 className="max-w-2xl text-balance text-3xl font-black leading-[1.03] text-white sm:text-5xl lg:text-[3.65rem]">
              Compact, Premium Websites That <span className="gold-text">Rank and Convert</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base lg:text-lg">
              Crafted with modern frontend engineering and technical SEO to deliver faster load time, cleaner UX, and measurable business growth.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {[
              "Lighthouse 96+",
              "Core Web Vitals",
              "Conversion-Focused",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/14 bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-200 sm:text-xs"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Link href="#contact" className="gold-button w-full px-2.5 py-2 text-xs sm:text-sm">
              Contact
            </Link>
            <Link href="#portfolio" className="ghost-button w-full px-2.5 py-2 text-xs sm:text-sm">
              Portfolio
            </Link>
            <Link
              href="https://apps.mdakash.me"
              target="_blank"
              rel="noopener noreferrer"
              className="apps-button w-full px-2.5 py-2 text-xs sm:text-sm"
            >
              <span aria-hidden="true">🚀</span>
              Apps
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {[
              ["120+", "Projects"],
              ["92%", "Retention"],
              ["6+", "Years"],
            ].map(([value, label]) => (
              <div key={label} className="site-card px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-lg font-extrabold leading-none text-gold-300 sm:text-xl">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="site-card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2.5">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-zinc-400">Recent Launch</p>
                <p className="text-sm font-semibold text-zinc-100">Corporate Growth Site</p>
              </div>
              <span className="rounded-full border border-gold-300/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] text-gold-200">
                Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                ["Lighthouse", "96"],
                ["SEO", "A+"],
                ["Avg Load", "1.3s"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-2.5 sm:p-3">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-400 sm:text-[11px]">{label}</p>
                  <p className="mt-1 text-lg font-extrabold leading-none text-gold-300 sm:text-2xl">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3.5 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Growth Dashboard</p>
                <span className="text-[11px] text-zinc-400">30 days</span>
              </div>

              <div className="space-y-3">
                {[
                  ["Organic Visibility", "+180%", "86%"],
                  ["Conversion Rate", "+46%", "74%"],
                  ["Core Web Vitals", "Pass", "93%"],
                ].map(([label, value, progress]) => (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-zinc-300">{label}</span>
                      <span className="font-semibold text-gold-300">{value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div className="gold-gradient h-full rounded-full" style={{ width: progress }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "SEO", "CRO", "Performance"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-gold-300/30 bg-gold-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-200 sm:px-3 sm:text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <Image
            src="/code-snippet.svg"
            alt="Code and analytics interface"
            width={430}
            height={170}
            priority
            fetchPriority="high"
            sizes="(min-width: 1280px) 430px, 92vw"
            className="absolute -bottom-8 -left-6 hidden rounded-2xl border border-white/15 bg-zinc-900/70 p-2 shadow-2xl xl:block"
          />
        </div>
      </div>
    </Container>
  );
}
