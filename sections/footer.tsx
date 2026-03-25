import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-400 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} <span className="gold-text">{siteConfig.name}</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
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
