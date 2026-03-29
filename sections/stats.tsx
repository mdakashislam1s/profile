import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";
import { stats } from "@/lib/site";

export function StatsSection() {
  return (
    <Container id="stats" className="py-16 sm:py-20">
      <Reveal className="site-card section-grid-divider grid gap-4 p-6 sm:grid-cols-2 sm:gap-6 sm:p-8 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="surface-outline rounded-2xl p-5 text-center">
            <Counter value={item.value} suffix={item.suffix} />
            <p className="mt-2 text-sm text-zinc-300">{item.label}</p>
          </article>
        ))}
      </Reveal>
    </Container>
  );
}
