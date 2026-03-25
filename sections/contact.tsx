import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <Container id="contact" className="py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="Let’s grow your business"
          description="Share your goals and I will map the fastest path to stronger rankings, better performance, and higher conversion impact."
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <form className="premium-card rounded-2xl p-6 sm:p-8" action="#" method="post">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-zinc-300">Name</span>
                <input type="text" name="name" required className="field-input" placeholder="Your full name" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-zinc-300">Email</span>
                <input type="email" name="email" required className="field-input" placeholder="you@company.com" />
              </label>
            </div>
            <label className="mt-4 block space-y-2 text-sm">
              <span className="text-zinc-300">Project Type</span>
              <input type="text" name="projectType" className="field-input" placeholder="SEO, redesign, full build" />
            </label>
            <label className="mt-4 block space-y-2 text-sm">
              <span className="text-zinc-300">Message</span>
              <textarea
                name="message"
                rows={5}
                required
                className="field-input resize-none"
                placeholder="Tell me your goals, timeline, and current challenges"
              />
            </label>
            <button type="submit" className="gold-button mt-6 w-full justify-center">
              Send Inquiry
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          <article className="premium-card rounded-2xl p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">Direct Contact</h3>
            <p className="text-zinc-300">
              Email: <a href={`mailto:${siteConfig.email}`} className="text-gold-300 hover:text-gold-200">{siteConfig.email}</a>
            </p>
            <p className="mt-2 text-zinc-300">
              WhatsApp: <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="text-gold-300 hover:text-gold-200">{siteConfig.whatsapp}</a>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`} className="ghost-button text-sm">
                Email Now
              </a>
              <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} className="gold-button text-sm">
                WhatsApp Chat
              </a>
            </div>
          </article>

          <article className="premium-card rounded-2xl p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">Social Presence</h3>
            <div className="flex flex-wrap gap-3">
              <Link href={siteConfig.social.linkedin} className="social-pill" target="_blank" rel="noreferrer">
                LinkedIn
              </Link>
              <Link href={siteConfig.social.github} className="social-pill" target="_blank" rel="noreferrer">
                GitHub
              </Link>
              <Link href={siteConfig.social.facebook} className="social-pill" target="_blank" rel="noreferrer">
                Facebook
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-gold-300/30 bg-gold-500/10 p-6">
            <p className="text-sm leading-relaxed text-zinc-200">
              Premium support for founders, agencies, and growth teams. Response typically within 24 hours.
            </p>
          </article>
        </Reveal>
      </div>
    </Container>
  );
}
