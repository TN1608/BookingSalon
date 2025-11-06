// src/components/fragments/BookingPage/WaitlistConfirm.tsx
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import type {SelectedDetail, WaitlistEntry} from "@/types/types";
import {format} from "date-fns";

interface WaitlistConfirmProps {
    items: SelectedDetail[];
    durations: number;
    selectedDate: string | null;
    selectedTime: string | null;
    total: number;
    onBack: () => void;
    onConfirm: () => void;
    waitlistEntries?: WaitlistEntry[];
}

export default function WaitlistConfirm({
                                            items,
                                            durations,
                                            selectedDate,
                                            selectedTime,
                                            total,
                                            onBack,
                                            onConfirm,
                                            waitlistEntries = [],
                                        }: WaitlistConfirmProps) {
    return (
        <section>
            <h2 className="text-2xl font-semibold">Confirm Waitlist</h2>

            <div className="mt-4 rounded-2xl border p-4">
                <h3 className="font-semibold">Waitlist entries</h3>
                <ul className="mt-2 text-sm space-y-2">
                    {waitlistEntries.length === 0 && <li className="text-muted-foreground">No entries</li>}
                    {waitlistEntries
                        .filter((e) => e.date)
                        .map((e, i) => (
                            <li key={i} className="flex items-center justify-between">
                <span>
                  {e.date ? format(e.date, "PPP") : "—"} • {e.time ?? "Any time"}
                </span>
                            </li>
                        ))}
                </ul>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
                <h3 className="font-semibold">Services</h3>
                <ul className="mt-2 text-sm">
                    {items.map(({service, variant}) => (
                        <li key={`${service.id}-${variant.id}`} className="flex items-center justify-between py-1">
                              <span>
                                {service.name} — {variant.name}
                              </span>
                            <span className="text-zinc-600 dark:text-zinc-400">${variant.price}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-2 text-sm text-muted-foreground">Duration: {durations} min</div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onConfirm} className="px-6">
                    Confirm Waitlist • ${total}
                </Button>
            </div>
        </section>
    );
}