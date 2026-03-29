import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-black/35 px-4 py-8 sm:px-8 lg:px-12">
      <div className="site-card mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 px-5 py-5 text-sm text-zinc-400 sm:flex-row sm:px-6">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} <span className="gold-text font-semibold">{siteConfig.name}</span>. Crafted for premium growth.
        </p>
        <div className="flex items-center gap-5">
          <Link href={siteConfig.social.linkedin} className="transition-colors hover:text-gold-300" target="_blank" rel="noreferrer">
            LinkedIn
          </Link>
          <Link href={siteConfig.social.github} className="transition-colors hover:text-gold-300" target="_blank" rel="noreferrer">
            GitHub
          </Link>
          <Link href={siteConfig.social.facebook} className="transition-colors hover:text-gold-300" target="_blank" rel="noreferrer">
            Facebook
          </Link>
        </div>
      </div>
    </footer>
  );
}
