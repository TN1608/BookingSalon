"use client"
import {motion} from "framer-motion";
import {container, fade, SelectedDetail} from "../../../types/types";
import type {SelectedProfessional, TStylist} from "../../../types/types";
import {Button} from "@/components/ui/button";
import {UserPlus2, Users, Check} from "lucide-react";
import React, {useMemo, useState} from "react";
import ProfileDialog from "@/components/ProfileDialog";
import {ServiceProDialog} from "@/components/ServiceProDialog";

interface ProfessionalProps {
    items: SelectedDetail[];
    stylists: TStylist[];
    professional: SelectedProfessional | null;
    setProfessional: (p: SelectedProfessional) => void;
    isAbove: boolean;
    onContinue: () => void;
    onBack?: () => void;
    getSelectedStylistId: (serviceId: string, variantId: string) => string | undefined;
    onSelectAnyForService: (serviceId: string, variantId?: string) => void;
    onSelectStylistForService: (stylistId: string, serviceId: string, variantId?: string) => void;
    onViewProfile: (id: string) => void;
}

export default function Professional({
                                         items,
                                         stylists,
                                         professional,
                                         setProfessional,
                                         onContinue,
                                         isAbove,
                                         getSelectedStylistId,
                                         onSelectAnyForService,
                                         onSelectStylistForService,
                                         onViewProfile,
                                     }: ProfessionalProps) {
    const isSelected = (p: SelectedProfessional) => {
        if (!professional) return false;
        if (p.mode !== professional.mode) return false;
        if (p.mode === "stylist" && professional.mode === "stylist") return p.stylistId === professional.stylistId;
        return true;
    };

    const [selectProPerService, setSelectProPerService] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const getSelectionLabel = (serviceId: string, variantId: string) => {
        const sid = getSelectedStylistId(serviceId, variantId);
        if (!sid) return "Any professional";
        const name = stylists.find((s) => s.id === sid)?.name;
        return name || "Any professional";
    };

    return (
        <>
            <section className={"min-h-screen"}>
                <h2 className="text-2xl font-semibold">Select professional</h2>

                {selectProPerService ? (
                    <>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="mt-4 grid grid-cols-1 gap-4"
                        >
                            {items.map(({service, variant}) => {
                                const compositeKey = `${service.id}||${variant.id}`;
                                const label = getSelectionLabel(service.id, variant.id);
                                return (
                                    <motion.div
                                        key={compositeKey}
                                        variants={fade}
                                        whileHover={{scale: 1.01}}
                                        whileTap={{scale: 0.995}}
                                        transition={{type: "spring", stiffness: 300, damping: 24}}
                                        className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="font-medium">{service.name}</div>
                                                <div className="text-xs text-muted-foreground">Choose a professional for
                                                    this service
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setActiveKey(compositeKey);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                {label}
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            <motion.div variants={fade} className="mt-2 flex justify-end">
                                <Button onClick={onContinue} disabled={!professional}>
                                    Continue
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Selection dialog (animated entrance) */}
                        <motion.div
                            initial={{opacity: 0, y: 8, scale: 0.99}}
                            animate={dialogOpen ? {opacity: 1, y: 0, scale: 1} : {opacity: 0, y: 8, scale: 0.99}}
                            transition={{duration: 0.14}}
                            style={{pointerEvents: dialogOpen ? "auto" : "none"}}
                        >
                            <ServiceProDialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                                title={items.find((it) => `${it.service.id}||${it.variant.id}` === activeKey)?.service.name || "Select professional"}
                                stylists={stylists}
                                selectedStylistId={activeKey ? (() => {
                                    const [sId, vId] = (activeKey as string).split("||");
                                    return getSelectedStylistId(sId, vId);
                                })() : undefined}
                                onSelectAny={() => {
                                    if (!activeKey) return;
                                    const [sId, vId] = activeKey.split("||");
                                    onSelectAnyForService(sId, vId);
                                    setDialogOpen(false);
                                }}
                                onSelectStylist={(stylistId) => {
                                    if (!activeKey) return;
                                    const [sId, vId] = activeKey.split("||");
                                    onSelectStylistForService(stylistId, sId, vId);
                                    setDialogOpen(false);
                                }}
                                onViewProfile={(id) => onViewProfile && onViewProfile(id)}
                            />
                        </motion.div>
                    </>
                ) : (
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
                                <div
                                    className="h-12 w-12 rounded-full grid place-items-center bg-rose-500/10 text-rose-600">
                                    <Users className="h-6 w-6"/>
                                </div>
                                <div>
                                    <div className="font-medium">Any professional</div>
                                    <div className="text-xs text-muted-foreground">for maximum availability</div>
                                </div>
                            </div>
                            <Button
                                variant={isSelected({mode: "any"}) ? "default" : "outline"}
                                onClick={() => setProfessional({mode: "any"})}
                            >
                                {isSelected({mode: "any"}) ? "Selected" : "Select"}
                            </Button>
                        </motion.div>

                        {/* Per service */}
                        {isAbove && (
                            <motion.div
                                variants={fade}
                                className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="h-12 w-12 rounded-full grid place-items-center bg-rose-500/10 text-rose-600">
                                        <UserPlus2 className="h-6 w-6"/>
                                    </div>
                                    <div>
                                        <div className="font-medium">Select professional per service</div>
                                        <div className="text-xs text-muted-foreground">assign a pro to each service
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant={isSelected({mode: "perService", map: {}}) ? "default" : "outline"}
                                    onClick={() => {
                                        setProfessional({mode: "perService", map: {}});
                                        setSelectProPerService(true)
                                    }}
                                >
                                    {isSelected({mode: "perService", map: {}}) ? "Selected" : "Select"}
                                </Button>
                            </motion.div>
                        )}

                        {/* Stylists */}
                        {stylists.map((s) => {
                            const selected = isSelected({mode: "stylist", stylistId: s.id});
                            return (
                                <motion.div
                                    key={s.id}
                                    variants={fade}
                                    className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-12 w-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 grid place-items-center text-sm font-semibold">
                                            {s.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{s.name}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{s.level} Stylist
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onViewProfile && onViewProfile(s.id)}
                                                className="mt-1 text-xs text-muted-foreground underline underline-offset-4"
                                            >
                                                View profile
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        variant={selected ? "default" : "outline"}
                                        onClick={() => setProfessional({mode: "stylist", stylistId: s.id})}
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
                )}
            </section>
        </>
    );
}