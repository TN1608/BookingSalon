"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ServicesSection() {
  const router = useRouter();

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const services = [
    { id: "mani", name: "Manicure", desc: "Classic, Gel & Extensions", price: "$25+" },
    { id: "pedi", name: "Pedicure", desc: "Spa & Deluxe", price: "$35+" },
    { id: "art", name: "Nail Art", desc: "Minimal to full set", price: "$20+" },
    { id: "care", name: "Nail Care", desc: "Repairs & maintenance", price: "$10+" },
  ];

  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Services</h2>
            <p className="mt-2 text-muted-foreground">Salon-perfect finishes for every style and occasion.</p>
          </div>
          <Button onClick={() => router.push("/booking")} className="hidden sm:inline-flex">Book now</Button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2, once: false }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {services.map(s => (
            <motion.div
              key={s.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{s.price}</span>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" onClick={() => router.push("/booking")}>Select</Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 sm:hidden">
          <Button className="w-full" onClick={() => router.push("/booking")}>Book now</Button>
        </div>
      </div>
    </section>
  );
}
