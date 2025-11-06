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
import ProfileDialog from "@/components/ProfileDialog";
import WaitlistConfirm from "@/components/fragments/BookingPage/WaitListConfirm";
import LoginDialog from "@/components/LoginDialog/LoginDialog";
import {useAuth} from "@/context/AuthProvider";
import {BookingPayload, checkout} from "@/services/checkout";
import {useRouter} from "next/navigation";
import {openSSE} from "@/services/sse";

export default function BookingPage() {
    const {showLogin, setShowLogin, currentUser} = useAuth();
    const router = useRouter();

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

    const [profileOpen, setProfileOpen] = useState(false);
    const [profileStylist, setProfileStylist] = useState<TStylist | null>(null);

    const [agreed, setAgreed] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "venue" | "paypal" | null>(null);
    const [code, setCode] = useState<string>("");
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
    const [note, setNote] = useState<string>("");

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
    const total = useMemo(() => selectedDetails.reduce((sum, d) => sum + d.variant.price, 0), [selectedDetails]);
    const finalTotal = useMemo(() => Math.max(0, total - appliedDiscount), [total, appliedDiscount]);

    const openProfile = (id: string) => {
        const s = STYLISTS.find((x) => x.id === id) || null;
        setProfileStylist(s);
        setProfileOpen(true);
    };

    const makeKey = (serviceId: string, variantId?: string) => variantId ? `${serviceId}||${variantId}` : `${serviceId}||*`;

    const hasDuplicate = (arr: SelectedItem[]) => {
        const seen = new Set<string>()
        for (const it of arr) {
            const key = `${it.serviceId}||${it.variantId}`;
            if (seen.has(key)) return true
            seen.add(key)
        }
        return false
    }

    const handleSetSelected = (value: SelectedItem[] | ((prev: SelectedItem[]) => SelectedItem[])) => {
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



    const isAbove = useMemo(() => selectedDetails.length >= 2, [selectedDetails]);

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

    const getSelectedStylistId = (serviceId: string, variantId: string) => {
        if (!professional) return undefined;

        if (serviceId) {
            if (professional.mode === "perService") {
                const map = professional.map || {};
                if (variantId) {
                    return map[makeKey(serviceId, variantId) ?? map[makeKey(serviceId)]];
                }
            }
            if (professional.mode === "stylist") return professional.stylistId;
            return undefined;
        } else {
            return professional.mode === "stylist" ? professional.stylistId : undefined;
        }
    }

    const handleSelectAny = (serviceId?: string, variantId?: string) => {
        if (!serviceId) {
            setProfessional({mode: "any"})
            return;
        }
        const currentMap = professional?.mode === "perService" ? professional.map || {} : {};
        const newMap = {...currentMap};
        if (variantId) {
            delete newMap[makeKey(serviceId, variantId)];
        } else {
            Object.keys(newMap).forEach(k => {
                if (k.startsWith(serviceId)) {
                    delete newMap[k]
                }
            })
        }

        setProfessional({mode: "perService", map: newMap});
    }

    const handleSelectStylist = (stylistId: string, serviceId?: string, variantId?: string) => {
        if (!serviceId) {
            setProfessional({mode: "stylist", stylistId})
            return;
        }
        const currentMap = professional?.mode === "perService" ? professional.map || {} : {};
        const newMap = {...currentMap};
        if (variantId) {
            newMap[makeKey(serviceId, variantId)] = stylistId;
        } else {
            newMap[makeKey(serviceId)] = stylistId;
        }
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

    const handleWaitlist = async () => {
        try {
            if (!currentUser?.email) {
                toast.error("No email available to send confirmation.");
                window.location.href = "/success";
                return;
            }
            await fetch('/api/send-waitlist-email', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: currentUser.email,
                    name: currentUser?.fullName ?? "Customer",
                    date: selectedDate,
                    time: selectedTime,
                    serviceName: selectedDetails.map((d) => d.service.name).join(", "),
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to send confirmation email.");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Email sent successfully:", data);
                    toast.success("Confirmation email sent.");
                })
                .catch((error) => {
                    console.error("Send confirmation failed:", error);
                    toast.error("Failed to send confirmation email.");
                });
            toast.success("Confirmation email sent.");
        } catch (err) {
            console.error("Failed to book now:", err);
            toast.error("Failed to book now.");
        }
    }
    const handleBookNow = (date: Date) => {
        const key = date.toISOString().slice(0, 10);
        setWaitlistActive(false)
        setSelectedDate(key)
        setSelectedTime(timeSlots[0] ?? null)
        setFromWaitlist(false)
    }

    const handleBookSuccess = async () => {
        const services = selectedDetails.map((d) => ({
            name: d.service.name,
            description: d.variant.name,
            quantity: 1,
            price: d.variant.price,
        }));

        const payload: BookingPayload = {
            // userId: currentUser?.id ?? null,
            userEmail: currentUser?.email ?? null,
            // phone: (currentUser as any)?.phone ?? null,
            services,
            totalPrice: total,
            discountPercent: 0,
            startTime: selectedDate ? `${selectedDate}T${selectedTime ?? "00:00:00"}` : null,
            totalDuration: durations,
            stylist: professional?.mode === "stylist" ? { id: professional.stylistId } : professional?.mode === "perService" ? null : null,
            notes: note,
        };

        try {
            const resp = await checkout(payload);
            const {appointmentId, url} = resp.data;
            console.log("Checkout response:", resp);
            await openSSE(resp.data.appointmentId);

            router.push(url)
        } catch (err: any) {
            console.error("Checkout error:", err);
            toast.error(err?.message || "Failed to start checkout.");
            return;
        }
        try {
            await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: currentUser?.email,
                    name: currentUser?.fullName ?? "Customer",
                    date: selectedDate,
                    time: selectedTime,
                    staffName: professional?.mode === "stylist"
                        ? STYLISTS.find((s) => s.id === professional.stylistId)?.name || "—"
                        : professional?.mode === "perService"
                            ? "Multiple Stylists"
                            : "—",
                    serviceName: selectedDetails.map((d) => d.service.name).join(", "),
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to send confirmation email.");
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error("Send confirmation failed:", error);
                    toast.error("Failed to send confirmation email.");
                });
            toast.success("Confirmation email sent.");
        } catch (err) {
            console.error("Send confirmation failed:", err);
            toast.error("Failed to send confirmation email.");
        }
        // window.location.href = "/success"
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
                                        onConfirm={handleWaitlist}
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
                                        onConfirm={handleBookSuccess}
                                        professional={professional}
                                        agreed={agreed}
                                        selectedPaymentMethod={selectedPaymentMethod}
                                        onPaymentMethodSelect={setSelectedPaymentMethod}
                                        finalTotal={finalTotal}
                                        code={code}
                                        setCode={setCode}
                                        appliedCode={appliedCode}
                                        setAppliedCode={setAppliedCode}
                                        setAppliedDiscount={setAppliedDiscount}
                                        appliedDiscount={appliedDiscount}
                                        setAgreed={setAgreed}
                                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                                        note={note}
                                        setNote={setNote}
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
                        step={step}
                        onRemove={(serviceId, variantId) =>
                            setSelected((prev) => prev.filter((p) => !(p.serviceId === serviceId && p.variantId === variantId)))
                        }
                        onContinue={goNext}
                        canContinue={step === 1 ? canContinueFromServices : step === 2 ? canContinueFromProfessional : canContinueFromSchedule}
                        onPayAndConfirm={handleBookSuccess}
                        professional={professional}
                        stylists={STYLISTS}
                        waitlistActive={waitlistActive}
                        waitlistEntries={waitlistEntries}
                        agreed={agreed}
                        selectedPaymentMethod={selectedPaymentMethod}
                        onPaymentMethodSelect={setSelectedPaymentMethod}
                        finalTotal={finalTotal}
                    />

                    <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)}
                                   professional={profileStylist}/>

                    <LoginDialog openLogin={showLogin} onOpenChange={setShowLogin}/>

                </div>
            </div>
        </div>
    );
}