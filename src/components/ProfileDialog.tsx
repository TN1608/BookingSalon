"use client"

import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Star} from "lucide-react"
import {motion, AnimatePresence} from "framer-motion"
import {useState} from "react"
import {TStylist} from "@/app/booking/constants";

interface ProfileDialogProps {
    open: boolean
    onClose: () => void
    professional: TStylist
}


export default function ProfileDialog({open, onClose, professional}: ProfileDialogProps) {
    const p = professional
    const [activeTab, setActiveTab] = useState("about")

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                {/* Header */}
                <DialogTitle className="flex items-start justify-between">
                    <div/>
                    <div className="flex-1">
                        <div className="flex flex-col items-center gap-3 mt-2">
                            {/* Avatar */}
                            {p?.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={p.avatarUrl || "/placeholder.svg"}
                                    alt={p?.name || "Stylist"}
                                    className="h-24 w-24 rounded-full object-cover shadow-sm"
                                />
                            ) : (
                                <div
                                    className="h-24 w-24 rounded-full grid place-items-center bg-neutral-200 dark:bg-neutral-800 text-2xl font-semibold">
                                    {(p?.name || "?").slice(0, 1)}
                                </div>
                            )}
                            <div className="text-center">
                                <div className="text-2xl font-semibold leading-tight">{p?.name || "Stylist"}</div>
                                <div className="text-sm text-muted-foreground">
                                    {p?.roleTitle || `${p?.level ? capitalize(p.level) : ""} Stylist`}
                                </div>
                                <div className="mt-1 flex items-center justify-center gap-1 text-sm">
                                    <span className="font-semibold">{(p?.rating ?? 5).toFixed(1)}</span>
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500"/>
                                    <a className="text-violet-600 hover:underline" href="#reviews">
                                        ({p?.reviewCount ?? 0})
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div/>
                </DialogTitle>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                    <TabsList className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-1 inline-flex">
                        <TabsTrigger value="about" className="rounded-full px-4 py-2 text-sm">
                            About
                        </TabsTrigger>
                        <TabsTrigger value="portfolio" className="rounded-full px-4 py-2 text-sm">
                            Portfolio
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="rounded-full px-4 py-2 text-sm">
                            Reviews
                            <span
                                className="ml-2 inline-flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 px-1.5 text-xs leading-5">
                {p?.reviewCount ?? 0}
              </span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-5 h-96 overflow-hidden">
                        <ScrollArea className="h-full w-full">
                            <AnimatePresence mode="wait">
                                {/* About Tab */}
                                {activeTab === "about" && (
                                    <motion.div
                                        key="about"
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.3, ease: "easeInOut"}}
                                        className="outline-none pr-4"
                                    >
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <div className="text-sm text-muted-foreground">Appointments completed
                                                </div>
                                                <div className="text-right text-lg font-medium">
                                                    {formatNumber(p?.appointmentsCompleted ?? 0)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm text-muted-foreground">Clients served</div>
                                                <div
                                                    className="text-right text-lg font-medium">{formatNumber(p?.clientsServed ?? 0)}</div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="font-semibold">Languages</div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {(p?.languages && p.languages.length > 0 ? p.languages : ["English"]).map((lang, idx) => (
                                                    <motion.span
                                                        key={lang}
                                                        initial={{opacity: 0, scale: 0.9}}
                                                        animate={{opacity: 1, scale: 1}}
                                                        transition={{delay: idx * 0.05, duration: 0.2}}
                                                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                                                    >
                                                        {lang}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <div className="text-xl font-semibold">Portfolio</div>
                                            {!p?.portfolio || p.portfolio.length === 0 ? (
                                                <p className="mt-2 text-muted-foreground">This professional doesn't have
                                                    a portfolio yet</p>
                                            ) : (
                                                <div className="mt-3 grid grid-cols-3 gap-3">
                                                    {p.portfolio.map((src, idx) => (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <motion.img
                                                            key={idx}
                                                            src={src || "/placeholder.svg"}
                                                            alt="work"
                                                            initial={{opacity: 0, scale: 0.9}}
                                                            animate={{opacity: 1, scale: 1}}
                                                            transition={{delay: idx * 0.05, duration: 0.3}}
                                                            className="h-24 w-full object-cover rounded-md"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Portfolio Tab */}
                                {activeTab === "portfolio" && (
                                    <motion.div
                                        key="portfolio"
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.3, ease: "easeInOut"}}
                                        className="outline-none pr-4"
                                    >
                                        {!p?.portfolio || p.portfolio.length === 0 ? (
                                            <p className="text-muted-foreground">This professional doesn't have a
                                                portfolio yet</p>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-3">
                                                {p.portfolio.map((src, idx) => (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <motion.img
                                                        key={idx}
                                                        src={src || "/placeholder.svg"}
                                                        alt="work"
                                                        initial={{opacity: 0, scale: 0.9}}
                                                        animate={{opacity: 1, scale: 1}}
                                                        transition={{delay: idx * 0.05, duration: 0.3}}
                                                        className="h-28 w-full object-cover rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Reviews Tab */}
                                {activeTab === "reviews" && (
                                    <motion.div
                                        key="reviews"
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.3, ease: "easeInOut"}}
                                        className="outline-none pr-4 space-y-4"
                                        id="reviews"
                                    >
                                        <AnimatePresence>
                                            {professional.reviews.map((review, idx) => (
                                                <motion.div
                                                    key={review.id}
                                                    initial={{opacity: 0, x: -20}}
                                                    animate={{opacity: 1, x: 0}}
                                                    transition={{delay: idx * 0.05, duration: 0.3}}
                                                    className="border-b pb-4 last:border-b-0"
                                                >
                                                    <div className="flex gap-3">
                                                        {/* Avatar */}
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={review.avatar || "/placeholder.svg"}
                                                            alt={review.name}
                                                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            {/* Name and Date */}
                                                            <div className="flex items-baseline justify-between gap-2">
                                                                <div
                                                                    className="font-semibold text-sm">{review.name}</div>
                                                                <div
                                                                    className="text-xs text-muted-foreground whitespace-nowrap">{review.date}</div>
                                                            </div>

                                                            {/* Rating */}
                                                            <div className="flex gap-0.5 mt-1">
                                                                {Array.from({length: review.rating}).map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        initial={{opacity: 0, scale: 0}}
                                                                        animate={{opacity: 1, scale: 1}}
                                                                        transition={{delay: i * 0.05, duration: 0.2}}
                                                                    >
                                                                        <Star
                                                                            className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500"/>
                                                                    </motion.div>
                                                                ))}
                                                            </div>

                                                            {/* Review Text */}
                                                            <p className="text-sm text-foreground mt-2 leading-relaxed">{review.text}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ScrollArea>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

function capitalize(s?: string) {
    if (!s) return ""
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatNumber(n: number) {
    return new Intl.NumberFormat().format(n)
}
