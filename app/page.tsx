import type { Metadata } from "next";
import { FloatingActions } from "@/components/floating-actions";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/lib/site";
import { AboutSection } from "@/sections/about";
import { BlogSection } from "@/sections/blog";
import { ContactSection } from "@/sections/contact";
import { FaqSection } from "@/sections/faq";
import { FooterSection } from "@/sections/footer";
import { HeroSection } from "@/sections/hero";
import { OffersSection } from "@/sections/offers";
import { PortfolioSection } from "@/sections/portfolio";
import { ServicesSection } from "@/sections/services";
import { SkillsSection } from "@/sections/skills";
import { StatsSection } from "@/sections/stats";
import { TestimonialsSection } from "@/sections/testimonials";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    alternates: {
      canonical: "/",
    },
  };
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background font-sans text-foreground">
      <a href="#home-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="home-content">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <SkillsSection />
        <PortfolioSection />
        <TestimonialsSection />
        <StatsSection />
        <BlogSection />
        <OffersSection />
        <FaqSection />
        <ContactSection />
      </main>
      <FloatingActions />
      <FooterSection />
    </div>
  );
}
