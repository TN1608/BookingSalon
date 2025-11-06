"use client"

import { CheckCircle2, Calendar, Clock, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function SuccessPage() {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        setShowContent(true)
    }, [])

    return (
        <div className="min-h-screen py-32 bg-gradient-to-br from-background via-secondary/20 to-background">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Success Icon */}
                    <div
                        className={`flex justify-center mb-8 transition-all duration-500 ${
                            showContent ? "animate-scale-pop" : "opacity-0"
                        }`}
                    >
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-16 h-16 text-primary animate-float" strokeWidth={1.5} />
                            </div>
                            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-bounce" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div
                        className={`text-center mb-8 transition-all duration-700 delay-100 ${
                            showContent ? "animate-slide-up opacity-100" : "opacity-0"
                        }`}
                    >
                        <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">You're on the list!</h1>
                        <p className="text-muted-foreground text-lg">
                            We've confirmed your spot at our salon. We're excited to see you soon!
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <div
                        className={`bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm transition-all duration-700 delay-200 ${
                            showContent ? "animate-slide-up opacity-100" : "opacity-0"
                        }`}
                    >
                        <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Your Waitlist Details
                        </h2>

                        <div className="space-y-4">
                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="font-medium text-foreground">Downtown Beauty Salon</p>
                                    <p className="text-sm text-muted-foreground">123 Main St, City Center</p>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Estimated Date</p>
                                    <p className="font-medium text-foreground">Saturday, November 15</p>
                                </div>
                            </div>

                            {/* Wait Time */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Position in Queue</p>
                                    <p className="font-medium text-foreground">#4 • Estimated 45 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Info */}
                    <div
                        className={`bg-secondary/30 border border-secondary rounded-2xl p-4 mb-8 transition-all duration-700 delay-300 ${
                            showContent ? "animate-slide-up opacity-100" : "opacity-0"
                        }`}
                    >
                        <p className="text-sm text-foreground">
                            <span className="font-semibold">Service: </span>
                            Gel Manicure + Nail Art
                        </p>
                        <p className="text-sm text-foreground mt-2">
                            <span className="font-semibold">Duration: </span>
                            60 minutes
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div
                        className={`space-y-3 transition-all duration-700 delay-400 ${
                            showContent ? "animate-slide-up opacity-100" : "opacity-0"
                        }`}
                    >
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold"
                        >
                            Track My Position
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-full border-border hover:bg-secondary/50 font-semibold bg-transparent"
                        >
                            Explore Other Services
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            className="w-full rounded-full text-muted-foreground hover:text-foreground font-semibold"
                        >
                            Back to Home
                        </Button>
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-xs text-muted-foreground mt-8">
                        You'll receive SMS and email notifications about your status
                    </p>
                </div>
            </div>
        </div>
    )
}