import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { FloatingActions } from "@/components/floating-actions";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/lib/site";
import { AboutSection } from "@/sections/about";
import { FooterSection } from "@/sections/footer";
import { HeroSection } from "@/sections/hero";
import { ServicesSection } from "@/sections/services";

const SkillsSection = dynamic(() => import("@/sections/skills").then((module) => module.SkillsSection));
const PortfolioSection = dynamic(() => import("@/sections/portfolio").then((module) => module.PortfolioSection));
const TestimonialsSection = dynamic(() => import("@/sections/testimonials").then((module) => module.TestimonialsSection));
const StatsSection = dynamic(() => import("@/sections/stats").then((module) => module.StatsSection));
const BlogSection = dynamic(() => import("@/sections/blog").then((module) => module.BlogSection));
const OffersSection = dynamic(() => import("@/sections/offers").then((module) => module.OffersSection));
const FaqSection = dynamic(() => import("@/sections/faq").then((module) => module.FaqSection));
const ContactSection = dynamic(() => import("@/sections/contact").then((module) => module.ContactSection));

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
