"use client"
import { motion } from "framer-motion";
import { container, fade } from "./types";
import type { SelectedProfessional, TStylist } from "./types";
import { Button } from "@/components/ui/button";
import { UserPlus2, Users } from "lucide-react";

interface ProfessionalProps {
  stylists: TStylist[];
  professional: SelectedProfessional | null;
  setProfessional: (p: SelectedProfessional) => void;
  onContinue: () => void;
  onBack?: () => void;
}

export default function Professional({ stylists, professional, setProfessional, onContinue }: ProfessionalProps) {
  const isSelected = (p: SelectedProfessional) => {
    if (!professional) return false;
    if (p.mode !== professional.mode) return false;
    if (p.mode === "stylist" && professional.mode === "stylist") return p.stylistId === professional.stylistId;
    return true;
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold">Select professional</h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-4 grid grid-cols-1 gap-4"
      >
        {/* Any professional */}
        <motion.div
          variants={fade}
          className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full grid place-items-center bg-rose-500/10 text-rose-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="font-medium">Any professional</div>
              <div className="text-xs text-muted-foreground">for maximum availability</div>
            </div>
          </div>
          <Button
            variant={isSelected({ mode: "any" }) ? "default" : "outline"}
            onClick={() => setProfessional({ mode: "any" })}
          >
            {isSelected({ mode: "any" }) ? "Selected" : "Select"}
          </Button>
        </motion.div>

        {/* Per service */}
        <motion.div
          variants={fade}
          className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full grid place-items-center bg-rose-500/10 text-rose-600">
              <UserPlus2 className="h-6 w-6" />
            </div>
            <div>
              <div className="font-medium">Select professional per service</div>
              <div className="text-xs text-muted-foreground">assign a pro to each service</div>
            </div>
          </div>
          <Button
            variant={isSelected({ mode: "perService", map: {} }) ? "default" : "outline"}
            onClick={() => setProfessional({ mode: "perService", map: {} })}
          >
            {isSelected({ mode: "perService", map: {} }) ? "Selected" : "Select"}
          </Button>
        </motion.div>

        {/* Stylists */}
        {stylists.map((s) => {
          const selected = isSelected({ mode: "stylist", stylistId: s.id });
          return (
            <motion.div
              key={s.id}
              variants={fade}
              className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 grid place-items-center text-sm font-semibold">
                  {s.name.slice(0,1)}
                </div>
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{s.level} Stylist</div>
                </div>
              </div>
              <Button
                variant={selected ? "default" : "outline"}
                onClick={() => setProfessional({ mode: "stylist", stylistId: s.id })}
              >
                {selected ? "Selected" : "Select"}
              </Button>
            </motion.div>
          );
        })}

        <div className="mt-2 flex justify-end">
          <Button onClick={onContinue} disabled={!professional}>
            Continue
          </Button>
        </div>
      </motion.div>
    </section>
  );
}