import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";
import { stats } from "@/lib/site";

export function StatsSection() {
  return (
    <Container id="stats" className="py-16 sm:py-20">
      <Reveal className="grid gap-4 rounded-2xl border border-gold-400/20 bg-zinc-900/60 p-6 sm:grid-cols-2 sm:gap-6 sm:p-8 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
            <Counter value={item.value} suffix={item.suffix} />
            <p className="mt-2 text-sm text-zinc-300">{item.label}</p>
          </article>
        ))}
      </Reveal>
    </Container>
  );
}
