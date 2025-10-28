"use client"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import CategoryChips from "./CategoryChips";
import VariantDialog from "./VariantDialog";
import {container, fade} from "../../../types/types";
import type {SelectedItem} from "../../../types/types";
import type {TService, TVariant} from "@/app/booking/constants";
import {FaPlus} from "react-icons/fa";
import {ScrollArea} from "@/components/ui/scroll-area";

interface ServicesProps {
    category: string;
    setCategory: (id: string) => void;
    services: TService[];
    selected: SelectedItem[];
    setSelected: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
    durations: number;
    total: number;
    onClear: () => void;
    onContinue: () => void;
    // Dialog control
    dialogService: TService | null;
    setDialogService: (s: TService | null) => void;
    variantDialogOpen: boolean;
    setVariantDialogOpen: (v: boolean) => void;
}

export default function Services({
                                     category,
                                     setCategory,
                                     services,
                                     selected,
                                     setSelected,
                                     durations,
                                     total,
                                     onClear,
                                     onContinue,
                                     dialogService,
                                     setDialogService,
                                     variantDialogOpen,
                                     setVariantDialogOpen,
                                 }: ServicesProps) {
    const filtered = services.filter((s) => category === "all" || s.categoryId === category);

    const handleAdd = (service: TService, variant: TVariant) => {
        setSelected((prev) =>
            prev.find((p) => p.serviceId === service.id && p.variantId === variant.id)
                ? prev
                : [...prev, {serviceId: service.id, variantId: variant.id}]
        );
        setVariantDialogOpen(false);
        setDialogService(null);
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold">Select services</h2>

            <CategoryChips category={category} setCategory={setCategory}/>

            <ScrollArea className={"mt-4"}>
                <motion.div key={category} variants={container} initial="hidden" animate="show"
                            className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px]">
                    {filtered.map((s) => {
                        const openDialog = () => {
                            setDialogService(s);
                            setVariantDialogOpen(true);
                        };
                        return (
                            <motion.div
                                key={s.id}
                                variants={fade}
                                className="group p-5 rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-colors border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{s.name}</h3>
                                        <p className="text-xs text-muted-foreground">{s.duration}</p>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.desc}</p>
                                        <div className="mt-2 text-xs text-muted-foreground">from ${s.basePrice}</div>
                                    </div>
                                    <div>
                                        <VariantDialog
                                            service={s}
                                            open={variantDialogOpen && dialogService?.id === s.id}
                                            onOpenChange={(v) => {
                                                setVariantDialogOpen(v);
                                                if (!v) setDialogService(null);
                                            }}
                                            onAdd={(v) => handleAdd(s, v)}
                                            trigger={
                                                <button
                                                    aria-label="add"
                                                    onClick={openDialog}
                                                    className="h-9 w-9 rounded-full border grid place-items-center text-base hover:bg-rose-500 hover:text-white transition-colors"
                                                >
                                                    <FaPlus/>
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </ScrollArea>
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Selected: {selected.length} • Est. {durations} min • Total ${total}
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClear}>
                        Clear
                    </Button>
                    <Button disabled={selected.length === 0} onClick={onContinue}>
                        Continue
                    </Button>
                </div>
            </div>
        </section>
    );
}
