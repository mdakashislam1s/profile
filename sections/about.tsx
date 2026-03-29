import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function AboutSection() {
  return (
    <Container id="about" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="About"
          title="Crafting digital authority through engineering + SEO precision"
          description="I am Md. Akash, a Bangladeshi web developer and SEO specialist focused on building premium digital experiences that drive measurable business growth."
        />
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.25fr] lg:items-stretch">
        <Reveal delay={0.08} className="relative">
          <div className="profile-shell rounded-2xl p-4 sm:p-5">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
              <Image
                src="/profile-placeholder.svg"
                alt="Md. Akash profile"
                width={700}
                height={860}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="grid gap-5">
          <article className="site-card site-card-hover p-6">
            <h3 className="mb-3 text-xl font-semibold text-white">Technical Depth</h3>
            <p className="muted-copy">
              I architect scalable websites with clean code, strong UX, and performance-first foundations.
            </p>
          </article>
          <article className="site-card site-card-hover p-6">
            <h3 className="mb-3 text-xl font-semibold text-white">SEO Strategy</h3>
            <p className="muted-copy">
              From technical SEO to entity-driven content strategy, I align execution with ranking intent.
            </p>
          </article>
          <article className="site-card site-card-hover p-6">
            <h3 className="mb-3 text-xl font-semibold text-white">Business Outcomes</h3>
            <p className="muted-copy">
              Every decision is tied to growth KPIs: visibility, qualified traffic, and conversion efficiency.
            </p>
          </article>
        </Reveal>
      </div>
    </Container>
  );
}
