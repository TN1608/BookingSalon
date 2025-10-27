"use client"
import {motion} from "framer-motion";
import {container, fade, SelectedDetail} from "../../../types/types";
import type {SelectedProfessional, TStylist} from "../../../types/types";
import {Button} from "@/components/ui/button";
import {UserPlus2, Users, Check} from "lucide-react";
import {useMemo, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import ProfileDialog from "@/components/ProfileDialog";

// Inline dialog component for selecting a professional per service
function ServiceProDialog({
                              open,
                              onOpenChange,
                              title,
                              stylists,
                              selectedStylistId,
                              onSelectAny,
                              onSelectStylist,
                              onViewProfile,
                          }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    title: string;
    stylists: TStylist[];
    selectedStylistId?: string;
    onSelectAny: () => void;
    onSelectStylist: (id: string) => void;
    onViewProfile: (id: string) => void;
}) {
    const isAnySelected = !selectedStylistId;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Any professional option */}
                    <button
                        className={`w-full text-left border rounded-xl p-4 flex items-center justify-between ${isAnySelected ? "border-violet-500" : "border-zinc-200 dark:border-zinc-800"}`}
                        onClick={onSelectAny}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="h-12 w-12 rounded-full grid place-items-center bg-violet-500/10 text-violet-600">
                                <Users className="h-6 w-6"/>
                            </div>
                            <div>
                                <div className="font-medium">Any professional</div>
                                <div className="text-xs text-muted-foreground">for maximum availability</div>
                            </div>
                        </div>
                        {isAnySelected && (
                            <span className="text-violet-600"><Check className="h-5 w-5"/></span>
                        )}
                    </button>

                    {/* Stylists list */}
                    <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
                        {stylists.map((s) => {
                            const selected = selectedStylistId === s.id;
                            return (
                                <div
                                    key={s.id}
                                    className={`border rounded-xl p-4 flex items-center justify-between ${selected ? "border-violet-500" : "border-zinc-200 dark:border-zinc-800"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-12 w-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 grid place-items-center text-sm font-semibold">
                                            {s.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{s.name}</div>
                                            <div
                                                className="text-xs text-muted-foreground capitalize">{s.level} Stylist
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onViewProfile(s.id)}
                                                className="mt-1 text-xs text-muted-foreground underline underline-offset-4"
                                            >
                                                View profile
                                            </button>
                                        </div>
                                    </div>
                                    <Button variant={selected ? "default" : "outline"}
                                            onClick={() => onSelectStylist(s.id)}>
                                        {selected ? "Selected" : "Select"}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface ProfessionalProps {
    items: SelectedDetail[];
    stylists: TStylist[];
    professional: SelectedProfessional | null;
    setProfessional: (p: SelectedProfessional) => void;
    isAbove: boolean;
    onContinue: () => void;
    onBack?: () => void;
}

export default function Professional({
                                         items,
                                         stylists,
                                         professional,
                                         setProfessional,
                                         onContinue,
                                         isAbove
                                     }: ProfessionalProps) {
    const isSelected = (p: SelectedProfessional) => {
        if (!professional) return false;
        if (p.mode !== professional.mode) return false;
        if (p.mode === "stylist" && professional.mode === "stylist") return p.stylistId === professional.stylistId;
        return true;
    };

    const [selectProPerService, setSelectProPerService] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

    // Profile dialog state
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileStylist, setProfileStylist] = useState<TStylist | null>(null);

    const openProfile = (id: string) => {
        const s = stylists.find((x) => x.id === id) || null;
        setProfileStylist(s);
        setProfileOpen(true);
    };

    const currentMap = (professional?.mode === "perService" ? professional.map : {}) as Record<string, string>;

    const getSelectionLabel = (serviceId: string) => {
        const sid = currentMap[serviceId];
        if (!sid) return "Any professional";
        const name = stylists.find((s) => s.id === sid)?.name;
        return name || "Any professional";
    };

    return (
        <>
        <section>
            <h2 className="text-2xl font-semibold">Select professional</h2>

            {selectProPerService ? (
                <>
                    <div

                        className="mt-4 grid grid-cols-1 gap-4"
                    >
                        {items.map(({service}) => {
                            const label = getSelectionLabel(service.id);
                            return (
                                <motion.div
                                    key={service.id}
                                    variants={fade}
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
                                                setActiveServiceId(service.id);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}

                        <div className="mt-2 flex justify-end">
                            <Button onClick={onContinue} disabled={!professional}>
                                Continue
                            </Button>
                        </div>
                    </div>

                    {/* Selection dialog */}
                    <ServiceProDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        title={items.find((it) => it.service.id === activeServiceId)?.service.name || "Select professional"}
                        stylists={stylists}
                        selectedStylistId={activeServiceId ? currentMap[activeServiceId] : undefined}
                        onSelectAny={() => {
                            if (!activeServiceId) return;
                            const newMap = {...currentMap};
                            delete newMap[activeServiceId];
                            setProfessional({mode: "perService", map: newMap});
                            setDialogOpen(false);
                        }}
                        onSelectStylist={(stylistId) => {
                            if (!activeServiceId) return;
                            const newMap = {...currentMap, [activeServiceId]: stylistId};
                            setProfessional({mode: "perService", map: newMap});
                            setDialogOpen(false);
                        }}
                        onViewProfile={(id) => openProfile(id)}
                    />
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
                                    <div className="text-xs text-muted-foreground">assign a pro to each service</div>
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
                                            onClick={() => openProfile(s.id)}
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
        <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} professional={profileStylist} />
        </>
    );
}