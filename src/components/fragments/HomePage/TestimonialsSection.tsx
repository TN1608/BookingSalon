"use client"
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { id: 1, name: "Ava M.", quote: "My gel manicure lasted over three weeks. Obsessed!", role: "Regular client" },
  { id: 2, name: "Sofia R.", quote: "Beautiful salon, relaxing vibes, and the sweetest techs.", role: "Bride-to-be" },
  { id: 3, name: "Lina K.", quote: "They nailed the design I brought—pun intended.", role: "Designer" },
];

export default function TestimonialsSection() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  return (
    <section id="testimonials" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">What clients say</h2>
        <p className="mt-2 text-muted-foreground">Real stories from our community.</p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {TESTIMONIALS.map(t => (
            <motion.figure key={t.id} variants={item} className="rounded-2xl border p-5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40">
              <blockquote className="text-lg">“{t.quote}”</blockquote>
              <figcaption className="mt-3 text-sm text-muted-foreground">— {t.name}, {t.role}</figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
