import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/lib/site";

export function TestimonialsSection() {
  return (
    <Container id="testimonials" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by founders and growth-focused teams"
          description="Professional collaboration, clean execution, and measurable performance gains."
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.08}>
            <article className="site-card site-card-hover h-full p-6">
              <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                <span className="mr-1 text-2xl leading-none text-gold-300">“</span>
                {item.quote}
              </p>
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-zinc-400">{item.role}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
