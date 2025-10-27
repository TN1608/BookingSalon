"use client"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {container, fade} from "../../../types/types";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import WaitlistPage from "@/components/fragments/BookingPage/WaitlistPage";
import type {WaitlistEntry} from "@/components/fragments/BookingPage";

interface DayItem {
    key: string;
    label: string
}

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
    // Waitlist
    waitlistActive: boolean;
    setWaitlistActive: (b: boolean) => void;
    waitlistEntries: WaitlistEntry[];
    onWaitlistChange: (index: number, patch: Partial<WaitlistEntry>) => void;
    onWaitlistAdd: () => void;
    onWaitlistRemove: (index: number) => void;
    canContinueWaitlist: boolean;
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
                                     waitlistActive,
                                     setWaitlistActive,
                                     waitlistEntries,
                                     onWaitlistChange,
                                     onWaitlistAdd,
                                     onWaitlistRemove,
                                     canContinueWaitlist,
                                 }: ScheduleProps) {

    if(waitlistActive) {
        return (
            <WaitlistPage
                entries={waitlistEntries}
                onChange={onWaitlistChange}
                onAdd={onWaitlistAdd}
                onRemove={onWaitlistRemove}
                onBack={() => setWaitlistActive(false)}
                onContinue={onContinue}
                canContinue={canContinueWaitlist}
            />
        )
    }


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
                                whileHover={{y: -2}}
                                whileTap={{scale: 0.98}}
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
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>

            <motion.div variants={container} initial="hidden" animate="show"
                        className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((t) => {
                    const disabled = false; // hook up availability later
                    const active = selectedTime === t;
                    return (
                        <motion.button
                            key={t}
                            variants={fade}
                            whileHover={!disabled ? {scale: 1.02} : undefined}
                            whileTap={!disabled ? {scale: 0.98} : undefined}
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
            <div className={"flex justify-center "}>
                <p className={"text-sm text-muted-foreground mt-2"}>Can’t find a suitable time? <span className={"text-primary font-semibold transition hover:underline cursor-pointer"} onClick={() => {setWaitlistActive(true)}}>Join waitlist</span> </p>
            </div>

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
