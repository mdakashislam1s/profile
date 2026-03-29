import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { skillGroups } from "@/lib/site";

export function SkillsSection() {
  return (
    <Container id="skills" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Skills"
          title="High-impact capabilities across development and SEO"
          description="A practical skill stack built to improve discoverability, performance, and business conversion."
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.category} delay={index * 0.08}>
            <article className="site-card site-card-hover p-6">
              <h3 className="mb-5 text-xl font-semibold text-white">{group.category}</h3>
              <div className="space-y-4">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-200">{skill.name}</span>
                      <span className="font-semibold text-gold-300">{skill.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div className="gold-gradient h-full rounded-full" style={{ width: `${skill.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
