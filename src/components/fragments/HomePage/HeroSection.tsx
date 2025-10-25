"use client"
import {useRef} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {motion, useScroll, useTransform} from "framer-motion";
import {useRouter} from "next/navigation";

export default function HeroSection() {
    const navigate = useRouter();
    const heroRef = useRef<HTMLDivElement>(null);

    // Motion-based parallax for background blobs
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const blobOneY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -40]);

    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-rose-50 via-white to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 lg:px-16 lg:py-32">
            {/* Soft gradient rings / blobs */}
            <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <motion.div style={{ y: blobOneY }} className="absolute top-24 left-8 w-64 h-64 bg-rose-300/20 dark:bg-rose-400/10 rounded-full blur-3xl" />
                <motion.div style={{ y: blobTwoY }} className="absolute bottom-16 right-10 w-80 h-80 bg-fuchsia-400/20 dark:bg-fuchsia-500/10 rounded-full blur-3xl" />
            </motion.div>

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                {/* Copy */}
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} className="text-center md:text-left">
                    <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold tracking-tight">
                        Bliss Nail Studio
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-fuchsia-600"> Elevate Your Shine</span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="mt-4 text-lg md:text-xl text-muted-foreground">
                        Relaxing treatments, chic designs, and flawless finishes. Book your perfect appointment in seconds.
                    </motion.p>
                    <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <Button size="lg" className="px-8 py-6 text-base"
                                onClick={() => {
                                    navigate.push("/booking");
                                }}
                        >Book Now</Button>
                        <Button size="lg" variant="outline" className="px-8 py-6 text-base">View Services</Button>
                    </motion.div>

                    {/* Quick steps */}
                    <motion.ul variants={fadeUp} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        {[
                            { n: "1", t: "Choose Service" },
                            { n: "2", t: "Pick Date & Time" },
                            { n: "3", t: "Confirm & Glow" }
                        ].map((s) => (
                            <li key={s.n} className="flex items-center gap-3 p-4 rounded-xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-semibold">{s.n}</span>
                                <span className="font-medium">{s.t}</span>
                            </li>
                        ))}
                    </motion.ul>
                </motion.div>

                {/* Visual */}
                <motion.div variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} className="relative">
                    <motion.div
                        initial={{ rotate: -6 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: "spring", stiffness: 60, damping: 14 }}
                        className="mx-auto max-w-[520px] rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden"
                    >
                        <Image src="/img/hero.jpg" alt="Nail art inspiration" width={600} height={680} className="w-full h-auto object-cover" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
