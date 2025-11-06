"use client"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {container, fade} from "../../../types/types";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import WaitlistPage from "@/components/fragments/BookingPage/WaitlistPage";
import type {WaitlistEntry} from "@/components/fragments/BookingPage";
import type {TStylist} from "../../../types/types";
import {ServiceProDialog} from "@/components/ServiceProDialog";

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
    // Unavailable + professionals
    unavailableDates?: string[];
    availableDates?: string[];
    onBookNow?: (date: Date) => void;
    nextAvailableMap?: Record<string, string>; // map from unavailable date key to next available date key
    stylists?: TStylist[];
    selectedStylistId?: string; // currently chosen stylist (if any)
    onSelectAny?: () => void;
    onSelectStylist?: (id: string) => void;
    onViewProfile?: (id: string) => void;
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
                                     unavailableDates = [],
                                     availableDates = [],
                                     onBookNow,
                                     nextAvailableMap = {},
                                     stylists = [],
                                     selectedStylistId,
                                     onSelectAny,
                                     onSelectStylist,
                                     onViewProfile,
                                 }: ScheduleProps) {

    const [proDialogOpen, setProDialogOpen] = useState(false);

    const isUnavailable = (key: string) => unavailableDates.includes(key);

    if (waitlistActive) {
        return (
            <WaitlistPage
                entries={waitlistEntries}
                onChange={onWaitlistChange}
                onAdd={onWaitlistAdd}
                onRemove={onWaitlistRemove}
                onBack={() => setWaitlistActive(false)}
                onContinue={onContinue}
                canContinue={canContinueWaitlist}
                availableDates={availableDates}
                onBookNow={onBookNow}
            />
        )
    }


    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            className={"min-h-screen"}
        >
            <motion.h2
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                className="text-2xl font-semibold"
            >
                Choose date & time
            </motion.h2>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1}}
            >
                <ScrollArea className="mt-6 p-4 border rounded-2xl">
                    <div className="flex gap-3 min-w-max p-2">
                        {days.map((d) => {
                            const active = selectedDate === d.key
                            const isDisable = isUnavailable(d.key)
                            const dateObj = new Date(d.key)
                            const dayNum = String(dateObj.getDate())
                            const weekday = dateObj.toLocaleDateString(undefined, {weekday: "short"})

                            return (
                                <motion.div
                                    key={d.key}
                                    className="flex flex-col items-center"
                                    whileHover={!isDisable ? {y: -4, scale: 1.05} : undefined}
                                    whileTap={!isDisable ? {scale: 0.95} : undefined}
                                    layout
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedDate(d.key)
                                            setSelectedTime("")
                                        }}
                                        aria-disabled={isDisable}
                                        className={`
                                            w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                                            transition-all duration-200 relative
                                            ${
                                            isDisable
                                                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-pointer"
                                                : active
                                                    ? "bg-violet-600 text-white shadow-lg ring-4 ring-violet-600/30"
                                                    : "bg-white text-gray-900 border border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }
                                        `}
                                    >
                                        {dayNum}
                                        {isDisable && !active && (
                                            <motion.span
                                                initial={{scale: 0}}
                                                animate={{scale: 1}}
                                                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500"
                                            />
                                        )}
                                    </button>

                                    <span
                                        className={`
                                            mt-1 text-xs font-medium
                                            ${
                                            active
                                                ? "text-violet-600 dark:text-violet-400"
                                                : isDisable
                                                    ? "text-gray-400 dark:text-gray-600"
                                                    : "text-gray-600 dark:text-gray-400"
                                        }
                                        `}
                                    >
                    {weekday}
                  </span>
                                </motion.div>
                            )
                        })}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </motion.div>

            {(() => {
                const isUnavailable = !!selectedDate && unavailableDates.includes(selectedDate)
                if (isUnavailable) {
                    const nextKey = selectedDate ? nextAvailableMap[selectedDate] : undefined
                    const nextLabel = nextKey ? days.find((d) => d.key === nextKey)?.label || nextKey : undefined
                    return (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.4, delay: 0.2}}
                            className="mt-6 border rounded-2xl p-8 sm:p-10 bg-white/60 dark:bg-neutral-900/60 border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                {(() => {
                                    const selectedStylist = stylists?.find((s) => s.id === selectedStylistId)
                                    const initials = selectedStylist?.name ? selectedStylist.name.slice(0, 1) : "PRO"
                                    return (
                                        <motion.div
                                            initial={{scale: 0}}
                                            animate={{scale: 1}}
                                            transition={{duration: 0.3, delay: 0.3}}
                                            className="h-14 w-14 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden grid place-items-center text-sm font-semibold"
                                        >
                                            {initials}
                                        </motion.div>
                                    )
                                })()}
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.4, delay: 0.35}}
                                >
                                    {(() => {
                                        const selectedStylist = stylists?.find((s) => s.id === selectedStylistId)
                                        const name = selectedStylist?.name
                                        return (
                                            <div className="text-xl sm:text-2xl font-semibold">
                                                {name ? `${name} is fully booked on this date` : "Fully booked on this date"}
                                            </div>
                                        )
                                    })()}
                                    {nextLabel && <div className="text-sm text-muted-foreground mt-1">Available
                                        from {nextLabel}</div>}
                                </motion.div>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.4, delay: 0.4}}
                                    className="flex gap-3 mt-2 flex-wrap justify-center"
                                >
                                    {nextKey && (
                                        <Button variant="outline" onClick={() => setSelectedDate(nextKey)}>
                                            Go to next available date
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={() => setProDialogOpen(true)}>
                                        Check all professionals
                                    </Button>
                                </motion.div>
                                <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-6"/>
                                <p className="text-sm text-muted-foreground">
                                    You can{" "}
                                    <span
                                        className="text-primary font-semibold transition hover:underline cursor-pointer"
                                        onClick={() => setWaitlistActive(true)}
                                    >
                    join the waitlist
                  </span>{" "}
                                    instead
                                </p>
                            </div>
                        </motion.div>
                    )
                }

                return (
                    <>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
                        >
                            {timeSlots.map((t) => {
                                const disabled = false
                                const active = selectedTime === t
                                return (
                                    <motion.button
                                        key={t}
                                        variants={fade}
                                        whileHover={!disabled ? {scale: 1.05, y: -2} : undefined}
                                        whileTap={!disabled ? {scale: 0.95} : undefined}
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
                                )
                            })}
                        </motion.div>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.4, delay: 0.3}}
                            className={"flex justify-center"}
                        >
                            <p className={"text-sm text-muted-foreground mt-2"}>
                                Can't find a suitable time?{" "}
                                <span
                                    className={"text-primary font-semibold transition hover:underline cursor-pointer"}
                                    onClick={() => setWaitlistActive(true)}
                                >
                  Join waitlist
                </span>
                            </p>
                        </motion.div>
                    </>
                )
            })()}

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.4}}
                className="mt-6 flex items-center justify-between"
            >
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button disabled={!canContinue} onClick={onContinue}>
                    Continue
                </Button>
            </motion.div>

            <ServiceProDialog
                open={proDialogOpen}
                onOpenChange={setProDialogOpen}
                title="Select professional"
                stylists={stylists}
                selectedStylistId={selectedStylistId}
                onSelectAny={() => {
                    onSelectAny && onSelectAny()
                    setProDialogOpen(false)
                }}
                onSelectStylist={(id) => {
                    onSelectStylist && onSelectStylist(id)
                    setProDialogOpen(false)
                }}
                onViewProfile={(id) => {
                    onViewProfile && onViewProfile(id)
                }}
            />
        </motion.section>
    );
}
