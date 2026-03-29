import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { blogs } from "@/lib/site";

export function BlogSection() {
  return (
    <Container id="blog" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="SEO insights for ambitious brands"
          description="Actionable knowledge on ranking strategy, performance optimization, and growth systems."
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {blogs.map((post, index) => (
          <Reveal key={post.title} delay={index * 0.08}>
            <article className="site-card site-card-hover group h-full p-6">
              <p className="mb-4 inline-flex rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-300">
                {post.tag}
              </p>
              <h3 className="mb-3 text-xl font-semibold text-white">{post.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-300">{post.excerpt}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
