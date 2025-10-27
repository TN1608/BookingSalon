"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { container, fade } from "../../../types/types";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

interface DayItem { key: string; label: string }

interface ScheduleProps {
  days: DayItem[];
  timeSlots: string[];
  selectedDate: string | null;
  setSelectedDate: (k: string) => void;
  selectedTime: string | null;
  setSelectedTime: (t: string) => void;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export default function Schedule({
  days,
  timeSlots,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  canContinue,
  onBack,
  onContinue,
}: ScheduleProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">Choose date & time</h2>

      <ScrollArea className="mt-4">
        <div className="flex gap-3 min-w-max pr-2">
          {days.map((d) => {
            const active = selectedDate === d.key;
            return (
              <motion.button
                key={d.key}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDate(d.key);
                  if (selectedTime) setSelectedTime("");
                }}
                className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap ${
                  active
                    ? "bg-rose-500 text-white border-rose-500"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {d.label}
              </motion.button>
            );
          })}
        </div>
          <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {timeSlots.map((t) => {
          const disabled = false; // hook up availability later
          const active = selectedTime === t;
          return (
            <motion.button
              key={t}
              variants={fade}
              whileHover={!disabled ? { scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
              disabled={disabled}
              onClick={() => setSelectedTime(t)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                active
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {t}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!canContinue} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </section>
  );
}
