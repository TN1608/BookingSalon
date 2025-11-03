"use client"
import {motion, AnimatePresence} from "framer-motion";
import {Button} from "@/components/ui/button";
import type {SelectedDetail, Step, WaitlistEntry} from "../../../types/types";
import {IoMdRemove} from "react-icons/io";
import {format} from "date-fns";

import type {SelectedProfessional, TStylist} from "../../../types/types";
import {Variants} from "motion";
import {useAuth} from "@/context/AuthProvider";

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
    // Waitlist
    waitlistActive?: boolean;
    waitlistEntries?: WaitlistEntry[];
    hasPaymentMethod?: boolean;
}

const listVariants: Variants = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {staggerChildren: 0.06}},
};

const itemVariants: Variants = {
    hidden: {opacity: 0, y: 8},
    show: {opacity: 1, y: 0, transition: {duration: 0.18, ease: [0.22, 1, 0.36, 1]}},
    exit: {opacity: 0, y: -8, transition: {duration: 0.12}},
};

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
                                         waitlistActive,
                                         waitlistEntries,
                                         hasPaymentMethod = false,
                                     }: SummaryAsideProps) {
    const {isAuthenticated, setShowLogin} = useAuth();

    const handlePayClick = () => {
        if (!isAuthenticated) {
            setShowLogin(true);
            return;
        }
        onPayAndConfirm?.();
    };

    return (
        <motion.aside
            layout
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="h-max rounded-2xl border p-5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40"
        >
            <h3 className="font-semibold">Services</h3>

            <motion.ul
                className="mt-3 space-y-2 text-sm max-h-64 overflow-auto pr-1"
                variants={listVariants}
                initial="hidden"
                animate="show"
            >
                <AnimatePresence initial={false}>
                    {items.length === 0 && (
                        <motion.li
                            key="empty"
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="text-muted-foreground"
                        >
                            No services selected
                        </motion.li>
                    )}

                    {items.map(({service, variant}) => {
                        const key = `${service.id}-${variant.id}`;
                        const getProLabel = () => {
                            if (!professional) return null;
                            if (professional.mode === "any") return "with any professional";
                            if (professional.mode === "stylist") {
                                const name = stylists?.find((s) => s.id === professional.stylistId)?.name;
                                return name ? `with ${name}` : "with selected professional";
                            }
                            if (professional.mode === "perService") {
                                const compositeKey = `${service.id}||${variant.id}`;
                                const sid = professional.map?.[compositeKey];
                                if (!sid) return "with any professional";
                                const name = stylists?.find((s) => s.id === sid)?.name;
                                return name ? `with ${name}` : "with any professional";
                            }
                            return null;
                        };
                        const proLabel = getProLabel();
                        return (
                            <motion.li
                                key={key}
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="flex items-center justify-between gap-2"
                            >
                                <div className="min-w-0">
                                    <div className="font-medium truncate">
                                        {service.name}
                                        {proLabel ? ` ${proLabel}` : ""}
                                    </div>
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
                                        <IoMdRemove/>
                                    </button>
                                </div>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </motion.ul>

            <motion.div
                className="mt-3 text-sm text-muted-foreground"
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.25}}
            >
                {waitlistActive ? (
                    <div className="space-y-1">
                        {waitlistEntries && waitlistEntries.length > 0 ? (
                            waitlistEntries
                                .filter((e) => e.date)
                                .map((e, i) => (
                                    <div key={i} className="flex items-center justify-between">
                    <span>
                      {e.date ? format(e.date, "PPP") : "—"}
                        {" "}•{" "}
                        {e.time ?? "Any time"}
                    </span>
                                    </div>
                                ))
                        ) : (
                            <span>Choose date & time</span>
                        )}
                    </div>
                ) : (
                    selectedDate && selectedTime ? `${selectedDate} • ${selectedTime}` : "Choose date & time"
                )}
            </motion.div>

            <motion.div
                className="mt-4 flex items-center justify-between border-t pt-4"
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.28, delay: 0.05}}
            >
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${total}</span>
            </motion.div>

            <div className="mt-4">
                {step < 4 ? (
                    <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                        <Button className="w-full" disabled={!canContinue} onClick={onContinue}>
                            Continue
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                        <Button className="w-full" onClick={handlePayClick}>
                            Pay and Confirm
                        </Button>
                    </motion.div>
                )}
                {!hasPaymentMethod && step >= 4 && (
                    <div className="mt-2 text-sm text-red-500">Select a payment method before paying.</div>
                )}
            </div>
        </motion.aside>
    );
}
