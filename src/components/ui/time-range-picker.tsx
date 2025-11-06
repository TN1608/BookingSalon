"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {cn} from "@/lib/utils"

interface TimeRangePickerProps {
    startTime?: string
    endTime?: string
    onStartTimeChange: (time: string) => void
    onEndTimeChange: (time: string) => void
    onDone: (start?: string, end?: string) => void
    onClear: () => void
}

const PRESET_TIMES = [
    {label: "Any time", start: undefined, end: undefined},
    {label: "Morning", start: "06:00", end: "12:00"},
    {label: "Afternoon", start: "12:00", end: "18:00"},
    {label: "Evening", start: "18:00", end: "23:59"},
]

const TIME_OPTIONS = Array.from({length: 24 * 2}, (_, i) => {
    const hours = Math.floor(i / 2)
    const minutes = (i % 2) * 30
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
})

export function TimeRangePicker({
                                    startTime = "12:00",
                                    endTime = "17:00",
                                    onStartTimeChange,
                                    onEndTimeChange,
                                    onDone,
                                    onClear,
                                }: TimeRangePickerProps) {
    const [localStart, setLocalStart] = useState<string | "">(startTime ?? "")
    const [localEnd, setLocalEnd] = useState<string | "">(endTime ?? "")

    // Sync local state when parent props change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalStart(startTime ?? "")
    }, [startTime])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalEnd(endTime ?? "")
    }, [endTime])

    const handlePresetClick = (start?: string, end?: string) => {
        if (start === undefined) {
            setLocalStart("")
            setLocalEnd("")
        } else {
            setLocalStart(start)
            setLocalEnd(end || "")
        }
    }

    const displayRange =
        localStart && localEnd
            ? `${localStart} - ${localEnd}`
            : localStart || localEnd
                ? `${localStart || startTime} - ${localEnd || endTime}`
                : "Select time"

    return (
        <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
            {/* Display Range */}
            <div className="text-center">
                <p className="text-lg font-semibold">{displayRange}</p>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
                {PRESET_TIMES.map((preset) => (
                    <Button
                        key={preset.label}
                        variant={
                            (localStart === (preset.start ?? "") && localEnd === (preset.end ?? "")) ||
                            (preset.label === "Any time" && !localStart && !localEnd)
                                ? "default"
                                : "outline"
                        }
                        onClick={() => handlePresetClick(preset.start, preset.end)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm",
                            (localStart === (preset.start ?? "") && localEnd === (preset.end ?? "")) ||
                            (preset.label === "Any time" && !localStart && !localEnd)
                                ? "bg-blue-600 text-foreground hover:bg-blue-700"
                                : "",
                        )}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-4 ">
                <div className="space-y-2 *:not-first:mt-2">
                    <Label htmlFor="time-start">From</Label>
                    <Select value={localStart} onValueChange={(v) => setLocalStart(v)}>
                        <SelectTrigger id="time-start" className="w-full">
                            <SelectValue placeholder="Select start time"/>
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                            {TIME_OPTIONS.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 *:not-first:mt-2">
                    <Label htmlFor="time-end">To</Label>
                    <Select value={localEnd} onValueChange={(v) => setLocalEnd(v)}>
                        <SelectTrigger id="time-end" className="w-full">
                            <SelectValue placeholder="Select end time"/>
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                            {TIME_OPTIONS.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
                <Button
                    variant="outline"
                    className={"px-8"}
                    onClick={() => {
                        setLocalStart("")
                        setLocalEnd("")
                        onClear()
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant={"default"}
                    className={"px-8"}
                    onClick={() => {
                        // notify parent of current local values directly to avoid stale reads
                        onStartTimeChange(localStart)
                        onEndTimeChange(localEnd)
                        onDone(localStart || undefined, localEnd || undefined)
                    }}
                >
                    Done
                </Button>
            </div>
        </div>
    )
}