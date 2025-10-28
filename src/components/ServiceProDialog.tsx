import {fade, SelectedDetail, type SelectedProfessional} from "@/types/types";
import type {TStylist} from "@/app/booking/constants";
import {useState} from "react";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Check, Users} from "lucide-react";

export function ServiceProDialog({
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
