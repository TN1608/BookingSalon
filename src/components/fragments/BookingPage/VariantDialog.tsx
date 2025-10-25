"use client"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import type {TService, TVariant} from "@/app/booking/constants";
import React from "react";

interface VariantDialogProps {
    service: TService;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onAdd: (variant: TVariant) => void;
    trigger: React.ReactNode;
}

export default function VariantDialog({service, open, onOpenChange, onAdd, trigger}: VariantDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {service.name}
                        <p className="text-sm font-light text-muted-foreground">{service.desc}</p>
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-2 space-y-2">
                    <h1 className={"text-lg font-semibold"}>Choose an option <span className="text-red-500">*</span>
                    </h1>
                    {service.variants.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => onAdd(v)}
                            className="w-full text-left p-3 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between"
                        >
                            <div>
                                <div className="font-medium">{v.name}</div>
                                <div className="text-xs text-muted-foreground">{v.duration}</div>
                            </div>
                            <div className="font-semibold">${v.price}</div>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
