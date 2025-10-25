"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  return (
    <section id="book" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: false }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border p-8 md:p-12 bg-gradient-to-r from-rose-100/70 via-white to-fuchsia-100/60 dark:from-rose-500/5 dark:via-neutral-900 dark:to-fuchsia-500/5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to glow?</h2>
              <p className="mt-2 text-muted-foreground">Book your appointment in seconds — limited slots daily.</p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => router.push("/booking")}>Book now</Button>
              <Button size="lg" variant="outline" onClick={() => {
                const el = document.getElementById("services");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>Explore services</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
