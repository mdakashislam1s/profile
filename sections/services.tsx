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
            <article className="site-card site-card-hover group h-full p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">{service.title}</h3>
              <p className="muted-copy text-sm">{service.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
