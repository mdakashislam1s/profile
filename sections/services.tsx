import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { services } from "@/lib/site";

export function ServicesSection() {
  return (
    <Container id="services" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title="Elite services engineered for ranking, trust, and growth"
          description="A focused service suite for businesses that expect high-impact digital performance."
        />
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 0.05}>
            <article className="group h-full rounded-2xl border border-gold-400/20 bg-zinc-900/50 p-6 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-gold-500/20">
              <h3 className="mb-3 text-xl font-semibold text-white">{service.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-300">{service.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
