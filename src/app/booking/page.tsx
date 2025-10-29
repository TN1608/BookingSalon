"use client"

import {useMemo, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {SERVICES as SERVICE_DATA, STYLISTS, type TService, type TVariant, type TStylist} from "@/app/booking/constants";
import {
    Header,
    Services as ServicesSection,
    Schedule as ScheduleSection,
    Review as ReviewSection,
    SummaryAside,
} from "@/components/fragments/BookingPage";

import type {SelectedItem, Step, SelectedProfessional, WaitlistEntry} from "@/components/fragments/BookingPage";
import Professional from "@/components/fragments/BookingPage/Professional";
import {toast} from "sonner";
import SuccessPage from "@/components/Success";
import ProfileDialog from "@/components/ProfileDialog";
import WaitlistConfirm from "@/components/fragments/BookingPage/WaitListConfirm";

export default function BookingPage() {
    const [step, setStep] = useState<Step>(1);
    const [selected, setSelected] = useState<SelectedItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [category, setCategory] = useState<string>("all");
    const [variantDialogOpen, setVariantDialogOpen] = useState(false);
    const [dialogService, setDialogService] = useState<TService | null>(null);
    const [professional, setProfessional] = useState<SelectedProfessional | null>(null);

    // Waitlist
    const [waitlistActive, setWaitlistActive] = useState(false);
    const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([{}]);
    const [fromWaitlist, setFromWaitlist] = useState(false)

    const [isSuccessful, setIsSuccessful] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);
    const [profileStylist, setProfileStylist] = useState<TStylist | null>(null);

    const openProfile = (id: string) => {
        const s = STYLISTS.find((x) => x.id === id) || null;
        setProfileStylist(s);
        setProfileOpen(true);
    };

    const hasDuplicate = (arr: SelectedItem[]) => {
        const seen = new Set<string>()
        for (const it of arr) {
            const key = `${it.serviceId}||${it.variantId}`;
            if (seen.has(key)) return true
            seen.add(key)
        }
        return false
    }

    const handleSetSelected =(value: SelectedItem[] | ((prev: SelectedItem[]) => SelectedItem[])) => {
        if (typeof value === "function") {
            setSelected((prev) => {
                const next = (value as (p: SelectedItem[]) => SelectedItem[])(prev);
                if (hasDuplicate(next)) {
                    toast.error("You already selected this exact service variant.");
                    return prev;
                }
                return next;
            });
        } else {
            if (hasDuplicate(value)) {
                toast.error("You already selected this exact service variant.");
                return;
            }
            setSelected(value);
        }
    }


    const selectedDetails = useMemo(
        () =>
            selected
                .map((it) => {
                    const s = SERVICE_DATA.find((x) => x.id === it.serviceId);
                    const v = s?.variants.find((x) => x.id === it.variantId);
                    return s && v ? {service: s, variant: v} : null;
                })
                .filter(Boolean) as { service: TService; variant: TVariant }[],
        [selected]
    );

    const isAbove = useMemo(() => selectedDetails.length >= 2, [selectedDetails]);

    const total = useMemo(() => selectedDetails.reduce((sum, d) => sum + d.variant.price, 0), [selectedDetails]);

    const parseDurationToMin = (str: string): number => {
        const hours = /([\d.]+)\s*hr/.exec(str)?.[1];
        const mins = /(\d+)\s*min/.exec(str)?.[1];
        let total = 0;
        if (hours) total += Math.round(parseFloat(hours) * 60);
        if (mins) total += parseInt(mins, 10);
        return total || 0;
    };
    const durations = useMemo(
        () => selectedDetails.reduce((sum, d) => sum + parseDurationToMin(d.variant.duration), 0),
        [selectedDetails]
    );

    const next14Days = useMemo(() => {
        const days: { key: string; label: string }[] = [];
        const now = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric"});
            days.push({key, label});
        }
        return days;
    }, []);

    const timeSlots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
    ];

    const canContinueFromServices = selected.length > 0;
    const canContinueFromProfessional = Boolean(professional);
    // const canContinueFromSchedule = waitlistActive
    //     ? waitlistEntries.some((e) => !!e.date)
    //     : Boolean(selectedDate && selectedTime);

    const goNext = () => setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : s === 3 ? 4 : 4));
    const goBack = () =>
        setStep((s) => {
            const next = s === 4 ? 3 : s === 3 ? 2 : 1;
            if (next < 4) setFromWaitlist(false);
            return next;
        })

    const goToConfirm = (cameFromWaitList = false) => {
        setFromWaitlist(cameFromWaitList)
        setStep(4)
    }

    const unAvailableDates = useMemo(() => {
        if (!professional) return [] as string[];

        if (professional.mode === "stylist") {
            const stylist = STYLISTS.find((s) => s.id === professional.stylistId);
            if (!stylist) return [] as string[];
            return stylist.unavailableDates;
        }

        if (professional.mode === "perService") {
            const stylistIds = Object.values(professional.map || {});
            const dates = new Set<string>();
            stylistIds.forEach((id) => {
                const st = STYLISTS.find((s) => s.id === id)
                st?.unavailableDates?.forEach((d) => dates.add(d))
            })
            return Array.from(dates);
        }

        return [] as string[];
    }, [professional])

    const getSelectedStylistId = (serviceId: string) => {
        if (!professional) return undefined;

        if (serviceId) {
            if (professional.mode === "perService") return (professional.map || {})[serviceId]
            if (professional.mode === "stylist") return professional.stylistId;
            return undefined;
        } else {
            return professional.mode === "stylist" ? professional.stylistId : undefined;
        }
    }

    const handleSelectAny = (serviceId?: string) => {
        if (!serviceId) {
            setProfessional({mode: "any"})
            return;
        }
        const currentMap = professional?.mode === "perService" ? professional.map || {} : {};
        const newMap = {...currentMap};
        delete newMap[serviceId];
        setProfessional({mode: "perService", map: newMap});
    }

    const handleSelectStylist = (stylistId: string, serviceId?: string) => {
        if (!serviceId) {
            setProfessional({mode: "stylist", stylistId})
            return;
        }
        const currentMap = professional?.mode === "perService" ? professional.map || {} : {};
        const newMap = {...currentMap};
        newMap[serviceId] = stylistId;
        setProfessional({mode: "perService", map: newMap});
    }

    const handleViewProfile = (stylistId: string) => {
        openProfile(stylistId);
    }

    const availableDates = useMemo(() => {
        const keys = next14Days.map((d) => d.key)
        const unavailableSet = new Set(unAvailableDates || [])
        return keys.filter((k) => !unavailableSet.has(k))
    }, [next14Days, unAvailableDates])

    const hasSelectedWaitlistsDate = waitlistEntries.some((e) => !!e.date);
    const hasAvailableNow = waitlistEntries.some(
        (e) => e.date && availableDates.includes(e.date.toISOString().slice(0, 10))
    )

    const canContinueFromSchedule = waitlistActive ? (hasSelectedWaitlistsDate && !hasAvailableNow) : Boolean(selectedDate && selectedTime);

    const handleBookNow = (date: Date) => {
        const key = date.toISOString().slice(0, 10);
        setWaitlistActive(false)
        setSelectedDate(key)
        setSelectedTime(timeSlots[0] ?? null)
        setFromWaitlist(false)
    }

    if (isSuccessful) {
        return (
            <motion.div
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.25}}>
                <SuccessPage/>
            </motion.div>
        );
    }
    return (
        <div
            className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 lg:py-32 lg:px-18">
            <div className="container mx-auto px-4 py-10">
                <Header step={step} setStep={setStep} waitlistActive={waitlistActive}/>

                <div className="mt-8 grid lg:grid-cols-3 gap-8">
                    {/* Main panel */}
                    <motion.main layout className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.section key="step1" initial={{opacity: 0, y: 8}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -8}} transition={{duration: 0.25}}>
                                    <ServicesSection
                                        category={category}
                                        setCategory={setCategory}
                                        services={SERVICE_DATA}
                                        selected={selected}
                                        setSelected={handleSetSelected}
                                        durations={durations}
                                        total={total}
                                        onClear={() => setSelected([])}
                                        onContinue={() => setStep(2)}
                                        dialogService={dialogService}
                                        setDialogService={setDialogService}
                                        variantDialogOpen={variantDialogOpen}
                                        setVariantDialogOpen={setVariantDialogOpen}
                                    />
                                </motion.section>
                            )}
                            {step === 2 && (
                                <motion.section key={"step2"} initial={{opacity: 0, y: 8}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -8}} transition={{duration: 0.25}}>
                                    <Professional
                                        items={selectedDetails}
                                        isAbove={isAbove}
                                        stylists={STYLISTS}
                                        professional={professional}
                                        setProfessional={setProfessional}
                                        onContinue={goNext}
                                        getSelectedStylistId={getSelectedStylistId}
                                        onSelectAnyForService={handleSelectAny}
                                        onSelectStylistForService={handleSelectStylist}
                                        onViewProfile={handleViewProfile}
                                    />
                                </motion.section>
                            )}
                            {step === 3 && (
                                <motion.section key="step3" initial={{opacity: 0, y: 8}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: -8}} transition={{duration: 0.25}}>
                                    <ScheduleSection
                                        days={next14Days}
                                        unavailableDates={unAvailableDates}
                                        availableDates={availableDates}
                                        selectedStylistId={professional?.mode === "stylist" ? professional.stylistId : undefined}
                                        timeSlots={timeSlots}
                                        selectedDate={selectedDate}
                                        setSelectedDate={(k) => {
                                            setSelectedDate(k);
                                            setSelectedTime(null);
                                        }}
                                        stylists={STYLISTS}
                                        selectedTime={selectedTime}
                                        setSelectedTime={(t) => setSelectedTime(t)}
                                        canContinue={canContinueFromSchedule}
                                        onBack={goBack}
                                        onContinue={() => goToConfirm(waitlistActive)}
                                        waitlistActive={waitlistActive}
                                        setWaitlistActive={setWaitlistActive}
                                        waitlistEntries={waitlistEntries}
                                        onWaitlistChange={(index, patch) => {
                                            setWaitlistEntries((prev) => prev.map((e, i) => i === index ? {...e, ...patch} : e));
                                        }}
                                        onWaitlistAdd={() => setWaitlistEntries((prev) => [...prev, {}])}
                                        onWaitlistRemove={(index) => setWaitlistEntries((prev) => prev.filter((_, i) => i !== index))}
                                        canContinueWaitlist={waitlistEntries.some((e) => !!e.date)}
                                        onSelectAny={() => handleSelectAny()}
                                        onSelectStylist={(id) => handleSelectStylist(id)}
                                        onViewProfile={handleViewProfile}
                                        onBookNow={handleBookNow}
                                    />
                                </motion.section>
                            )}

                            {step === 4 && (
                                fromWaitlist ? (
                                    <WaitlistConfirm
                                        items={selectedDetails}
                                        durations={durations}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        total={total}
                                        onBack={goBack}
                                        onConfirm={() => {
                                            setIsSuccessful(true);
                                        }}
                                        waitlistEntries={waitlistEntries}
                                    />
                                ) : (
                                    <ReviewSection
                                        items={selectedDetails}
                                        durations={durations}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        total={total}
                                        onBack={goBack}
                                        onConfirm={() => {
                                            setIsSuccessful(true);
                                        }}
                                    />
                                )
                            )}
                        </AnimatePresence>
                    </motion.main>

                    <SummaryAside
                        items={selectedDetails}
                        selectedCount={selected.length}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        total={total}
                        step={step}
                        onRemove={(serviceId, variantId) =>
                            setSelected((prev) => prev.filter((p) => !(p.serviceId === serviceId && p.variantId === variantId)))
                        }
                        onContinue={goNext}
                        canContinue={step === 1 ? canContinueFromServices : step === 2 ? canContinueFromProfessional : canContinueFromSchedule}
                        onPayAndConfirm={() => {
                            setIsSuccessful(true);
                        }}
                        professional={professional}
                        stylists={STYLISTS}
                        waitlistActive={waitlistActive}
                        waitlistEntries={waitlistEntries}
                    />

                    <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)}
                                   professional={profileStylist}/>

                </div>
            </div>
        </div>
    );
}