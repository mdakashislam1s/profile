import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { projects } from "@/lib/site";

export function PortfolioSection() {
  return (
    <Container id="portfolio" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Portfolio"
          title="Case studies that prove strategy with measurable outcomes"
          description="Each engagement combines technical excellence with an SEO growth roadmap."
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 0.08}>
            <article className="premium-card group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.015] hover:border-gold-300/50 hover:shadow-2xl hover:shadow-gold-500/15">
              <Image
                src={project.image}
                alt={project.title}
                width={720}
                height={420}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-4 p-6">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <div className="space-y-2 text-sm leading-relaxed text-zinc-300">
                  <p><span className="font-semibold text-gold-300">Problem:</span> {project.problem}</p>
                  <p><span className="font-semibold text-gold-300">Solution:</span> {project.solution}</p>
                  <p><span className="font-semibold text-gold-300">Result:</span> {project.result}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
