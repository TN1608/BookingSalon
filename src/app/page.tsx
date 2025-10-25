"use client"

import HeroSection from "@/components/fragments/HomePage/HeroSection";
import ServicesSection from "@/components/fragments/HomePage/ServicesSection";
import GallerySection from "@/components/fragments/HomePage/GallerySection";
import TestimonialsSection from "@/components/fragments/HomePage/TestimonialsSection";
import CTASection from "@/components/fragments/HomePage/CTASection";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-rose-50 via-white to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950">
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
