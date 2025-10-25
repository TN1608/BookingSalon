"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { SelectedDetail, Step } from "./types";
import { IoMdRemove } from "react-icons/io";

import type { SelectedProfessional, TStylist } from "./types";

interface SummaryAsideProps {
  items: SelectedDetail[];
  selectedCount: number;
  selectedDate: string | null;
  selectedTime: string | null;
  total: number;
  step: Step;
  onRemove: (serviceId: string, variantId: string) => void;
  onContinue: () => void;
  canContinue: boolean;
  onPayAndConfirm?: () => void;
  professional?: SelectedProfessional | null;
  stylists?: TStylist[];
}

export default function SummaryAside({
  items,
  selectedCount,
  selectedDate,
  selectedTime,
  total,
  step,
  onRemove,
  onContinue,
  canContinue,
  onPayAndConfirm,
  professional,
  stylists,
}: SummaryAsideProps) {
  return (
    <motion.aside
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-max rounded-2xl border p-5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40"
    >
      <h3 className="font-semibold">Services</h3>
      <ul className="mt-3 space-y-2 text-sm max-h-64 overflow-auto pr-1">
        {items.length === 0 && (
          <li className="text-muted-foreground">No services selected</li>
        )}
        {items.map(({ service, variant }) => {
          const key = `${service.id}-${variant.id}`;
          const getProLabel = () => {
            if (!professional) return null;
            if (professional.mode === "any") return "with any professional";
            if (professional.mode === "stylist") {
              const name = stylists?.find((s) => s.id === professional.stylistId)?.name;
              return name ? `with ${name}` : "with selected professional";
            }
            if (professional.mode === "perService") {
              const sid = professional.map[service.id];
              if (!sid) return "with any professional";
              const name = stylists?.find((s) => s.id === sid)?.name;
              return name ? `with ${name}` : "with any professional";
            }
            return null;
          };
          const proLabel = getProLabel();
          return (
            <li key={key} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{service.name}{proLabel ? ` ${proLabel}` : ""}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {variant.name} • {variant.duration}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">${variant.price}</span>
                <button
                  aria-label="remove"
                  onClick={() => onRemove(service.id, variant.id)}
                  className="h-6 w-6 grid place-items-center rounded-full border hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <IoMdRemove />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 text-sm text-muted-foreground">
        {selectedDate && selectedTime ? `${selectedDate} • ${selectedTime}` : "Choose date & time"}
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">${total}</span>
      </div>
      <div className="mt-4">
        {step < 4 ? (
          <Button className="w-full" disabled={!canContinue} onClick={onContinue}>
            Continue
          </Button>
        ) : (
          <Button className="w-full" onClick={onPayAndConfirm}>
            Pay and Confirm
          </Button>
        )}
      </div>
    </motion.aside>
  );
}
