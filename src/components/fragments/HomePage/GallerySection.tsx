"use client"
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  { id: 1, src: "/img/gallery1.jpg", alt: "Minimal gel manicure" },
  { id: 2, src: "/img/gallery2.jpg", alt: "French tips" },
  { id: 3, src: "/img/gallery3.jpg", alt: "Sparkle set" },
  { id: 4, src: "/img/gallery4.jpg", alt: "Pastel palette" },
  { id: 5, src: "/img/gallery5.jpg", alt: "Floral art" },
  { id: 6, src: "/img/gallery6.jpg", alt: "Bold color block" },
];

export default function GallerySection() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <section id="gallery" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gallery</h2>
            <p className="mt-2 text-muted-foreground">A peek at recent sets from our artists.</p>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {images.map(img => (
            <motion.div key={img.id} variants={item} whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-xl border">
              <Image src={img.src} alt={img.alt} width={600} height={600} className="w-full h-auto object-cover" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
