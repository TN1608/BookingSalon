import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {useId, useState} from "react";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon, Trash2, Plus} from "lucide-react";
import type {WaitlistEntry} from "@/components/fragments/BookingPage";
import {Calendar} from "@/components/ui/calendar";

interface WaitlistPageProps {
    entries: WaitlistEntry[];
    onChange: (index: number, patch: Partial<WaitlistEntry>) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onBack: () => void;
    onContinue: () => void;
    canContinue: boolean;
}

const TIME_OPTIONS: string[] = [
    "Any time",
    "09:00 – 11:00",
    "11:00 – 13:00",
    "13:00 – 15:00",
    "15:00 – 17:00",
    "17:00 – 19:00",
];

export default function WaitlistPage({
                                         entries,
                                         onChange,
                                         onAdd,
                                         onRemove,
                                         onBack,
                                         onContinue,
                                         canContinue
                                     }: WaitlistPageProps) {
    const baseId = useId();
    return (
        <section>
            <h2 className="text-2xl font-semibold">Join the waitlist</h2>
            <p className="text-sm text-muted-foreground mt-1">Select your preferred dates and times. We’ll notify you if
                a time slot becomes available.</p>

            <div className="flex flex-col gap-3 mt-4">
                {entries.map((row, idx) => {
                    const dateInputId = `${baseId}-date-${idx}`;
                    const timeInputId = `${baseId}-time-${idx}`;
                    return (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                            {/* Date */}
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={dateInputId}>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id={dateInputId}
                                            variant={"outline"}
                                            className="group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                        >
                                              <span
                                                  className={cn("truncate", !row.date && "text-muted-foreground")}
                                              >
                                                {row.date ? format(row.date, "PPP") : "Pick a date"}
                                              </span>
                                            <CalendarIcon
                                                size={16}
                                                className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                                                aria-hidden="true"
                                            />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2" align="start">
                                        <Calendar
                                            id={`${dateInputId}-calendar`}
                                            mode="single" selected={row.date} onSelect={(d) => onChange(idx, {date: d})}/>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Time */}
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={timeInputId}>Time</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id={timeInputId}
                                            variant="outline"
                                            className="group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                        >
                                            <span
                                                className={cn("truncate", !row.time && "text-muted-foreground")}>{row.time ?? "Any time"}</span>
                                            <span className="text-muted-foreground">▾</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-0" align="start">
                                        <ul className="max-h-60 overflow-auto py-1">
                                            {TIME_OPTIONS.map((opt) => (
                                                <li key={opt}>
                                                    <button
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                        onClick={() => onChange(idx, {time: opt === "Any time" ? undefined : opt})}
                                                    >
                                                        {opt}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Remove */}
                            <div className="pb-2 md:pb-0">
                                <Button variant="outline" size="icon" onClick={() => onRemove(idx)} aria-label="Remove">
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    )
                })}
                <div>
                    <Button variant="ghost" onClick={onAdd} className="gap-2"><Plus className="h-4 w-4"/> Add another
                        time</Button>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button disabled={!canContinue} onClick={onContinue}>Continue</Button>
            </div>
        </section>
    );
}