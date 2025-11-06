"use client"

import {AnimatePresence, motion} from "framer-motion"
import {Label} from "@/components/ui/label"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@/components/ui/button"
import {useId} from "react"
import {cn} from "@/lib/utils"
import {format} from "date-fns"
import {CalendarIcon, Trash2, Plus} from "lucide-react"
import type {WaitlistEntry} from "@/components/fragments/BookingPage"
import {Calendar} from "@/components/ui/calendar"
import {FaChevronRight} from "react-icons/fa"
import {TimeRangePicker} from "@/components/ui/time-range-picker"
import {listItem, staggerList} from "@/lib/animation";

interface WaitlistPageProps {
    entries: WaitlistEntry[]
    onChange: (index: number, patch: Partial<WaitlistEntry>) => void
    onAdd: () => void
    onRemove: (index: number) => void
    onBack: () => void
    onContinue: () => void
    canContinue: boolean
    availableDates: string[]
    onBookNow?: (date: Date) => void
}

export default function WaitlistPage({
                                         entries,
                                         onChange,
                                         onAdd,
                                         onRemove,
                                         onBack,
                                         onContinue,
                                         canContinue,
                                         availableDates,
                                         onBookNow,
                                     }: WaitlistPageProps) {
    const baseId = useId()
    // const containerId = useId()
    const availableEntries = entries.filter((r) => r.date && availableDates.includes(r.date.toISOString().slice(0, 10)))
    const firstAvailableDate = availableEntries.length > 0 ? availableEntries[0].date! : undefined
    const availableCount = availableEntries.length
    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            className={"min-h-screen"}
        >
            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                <h2 className="text-2xl font-semibold">Join the waitlist</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Select your preferred dates and times. We&#39;ll notify you if a time slot becomes available.
                </p>
            </motion.div>

            {availableCount > 0 && firstAvailableDate && (
                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.4, delay: 0.1}}
                    className={
                        "mt-4 rounded-md bg-indigo-300 text-accent border-indigo-900 p-4 flex items-center justify-between gap-3"
                    }
                >
                    <div>
                        There {availableCount === 1 ? "is" : "are"} {availableCount} selected{" "}
                        {availableCount === 1 ? "entry" : "entries"} with available time
                        slot{availableCount === 1 ? "" : "s"}. You
                        can book now or adjust your selection.
                    </div>
                    <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center gap-2">
                        <Button
                            className={"gap-2 items-center flex justify-center"}
                            variant="default"
                            onClick={() => {
                                onBookNow?.(firstAvailableDate)
                            }}
                        >
                            Book now <FaChevronRight className={"text-accent"}/>
                        </Button>
                    </motion.div>
                </motion.div>
            )}

            <motion.div variants={staggerList} initial={false} animate="show" className="flex flex-col gap-3 mt-4">
                <AnimatePresence initial={false}>
                    {entries.map((row, idx) => {
                        const itemKey = `${row.date?.getTime() ?? "no-date"}-${row.startTime ?? "s"}-${row.endTime ?? "e"}-${idx}`
                        const dateInputId = `${baseId}-date-${idx}`
                        const timeInputId = `${baseId}-time-${idx}`
                        // const isAvailableNow = !!row.date && availableDates.includes(row.date.toISOString().slice(0, 10))
                        return (
                            <motion.div
                                key={itemKey}
                                variants={listItem}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                layout
                            >
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                                    {/* Date */}
                                    <div className="*:not-first:mt-2">
                                        <Label htmlFor={dateInputId}>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                                    <Button
                                                        id={dateInputId}
                                                        variant={"outline"}
                                                        className="group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                                    >
                                                      <span
                                                          className={cn("truncate", !row.date && "text-muted-foreground")}>
                                                        {row.date ? format(row.date, "PPP") : "Pick a date"}
                                                      </span>
                                                        <CalendarIcon
                                                            size={16}
                                                            className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                                                            aria-hidden="true"
                                                        />
                                                    </Button>
                                                </motion.div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-2" align="start">
                                                <Calendar
                                                    id={`${dateInputId}-calendar`}
                                                    mode="single"
                                                    selected={row.date}
                                                    onSelect={(d) => onChange(idx, {date: d})}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="*:not-first:mt-2">
                                        <Label htmlFor={timeInputId}>Time</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                                    <Button
                                                        id={timeInputId}
                                                        variant="outline"
                                                        className="group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
                                                    >
                                                          <span className={cn("truncate", !row.time && "text-muted-foreground")}>
                                                            {row.time ?? "Any time"}
                                                          </span>
                                                        <span className="text-muted-foreground">▾</span>
                                                    </Button>
                                                </motion.div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <TimeRangePicker
                                                    startTime={row.startTime || "12:00"}
                                                    endTime={row.endTime || "17:00"}
                                                    onStartTimeChange={(start) => onChange(idx, {startTime: start})}
                                                    onEndTimeChange={(end) => onChange(idx, {endTime: end})}
                                                    onDone={(start, end) => {
                                                        if (!start && !end) {
                                                            onChange(idx, {
                                                                time: "Any time",
                                                                startTime: "",
                                                                endTime: ""
                                                            })
                                                        } else {
                                                            const displayTime = `${start ?? "12:00"} - ${end ?? "17:00"}`
                                                            onChange(idx, {
                                                                time: displayTime,
                                                                startTime: start ?? "",
                                                                endTime: end ?? ""
                                                            })
                                                        }
                                                    }}
                                                    onClear={() => onChange(idx, {
                                                        time: "Any time",
                                                        startTime: "",
                                                        endTime: ""
                                                    })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Remove */}
                                    <div className="pb-2 md:pb-0">
                                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                            <Button variant="outline" size="icon" onClick={() => onRemove(idx)}
                                                    aria-label="Remove">
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.4, delay: 0.2}}>
                    <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <Button variant="ghost" onClick={onAdd} className="gap-2">
                            <Plus className="h-4 w-4"/> Add another time
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: 0.3}}
                className="mt-6 flex items-center justify-between"
            >
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button disabled={!canContinue} onClick={onContinue}>
                    Continue
                </Button>
            </motion.div>
        </motion.section>
    )
}