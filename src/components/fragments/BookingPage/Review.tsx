"use client"
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import type {SelectedDetail} from "../../../types/types";
import {MdPayments} from "react-icons/md";
import {Input} from "@/components/ui/input";
import {useEffect, useMemo, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import TermDialog from "@/components/TermDialog";
import {Textarea} from "@/components/ui/textarea";
import DialogCardDetails from "@/components/DialogCardDetails";
import {FaPaypal} from "react-icons/fa";
import {useAuth} from "@/context/AuthProvider";
import LoginDialog from "@/components/LoginDialog";

interface ReviewProps {
    items: SelectedDetail[];
    durations: number;
    selectedDate: string | null;
    selectedTime: string | null;
    total: number;
    onBack: () => void;
    onConfirm: () => void;
}

type PaymentMethod = "card" | "venue" | "paypal" | null;

export default function Review({items, durations, selectedDate, selectedTime, total, onBack, onConfirm}: ReviewProps) {
    const {updateCard, user} = useAuth();

    const [error, setError] = useState<string | null>(null);
    const [code, setCode] = useState<string>("");
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
    const [agreed, setAgreed] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [openCardAfterLogin, setOpenCardAfterLogin] = useState(false);

    const finalTotal = useMemo(() => Math.max(0, total - appliedDiscount), [total, appliedDiscount]);

    const validateCode = (raw: string) => {
        const c = raw.trim().toUpperCase();
        if (c.length !== 6) {
            setError("Discount code must be 6 characters long.");
            return false;
        }
        if (!/^[A-Z0-9]+$/.test(c)) {
            setError("Discount code must contain only uppercase letters and numbers.");
            return false;
        }
        if (c !== "SAVE20") {
            setError("Invalid discount code.");
            return false;
        }
        if (appliedCode === c) {
            setError("Code already applied.");
            return false;
        }
        setError(null);
        setAppliedCode(c);
        setAppliedDiscount(20);
        return true;
    };

    // Tu dong chon card neu trong session co thong tin
    useEffect(() => {
        if (user?.card?.number) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedPaymentMethod("card");
        } else {
            if (selectedPaymentMethod === "card") setSelectedPaymentMethod(null);
        }
    }, [user?.card?.number]);

    // After login, if we wanted to open card dialog, do it now
    useEffect(() => {
        if (user && openCardAfterLogin) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenCardAfterLogin(false);
            setDialogOpen(true);
        }
    }, [user, openCardAfterLogin]);

    useEffect(() => {
        if (total === 0 && appliedCode) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAppliedCode(null);
            setAppliedDiscount(0);
            setCode("");
            setError(null);
            return;
        }

        if (appliedDiscount > total) {
            setAppliedDiscount(Math.min(appliedDiscount, total));
        }
    }, [appliedCode, appliedDiscount, total]);

    const handleCardSave = (card: {
        name?: string;
        number?: string;
        expiry?: string;
        cvc?: string;
        cardType?: string | null;
    }) => {
        updateCard(card);
        setSelectedPaymentMethod("card");
    };

    const hasCard = !!user?.card?.number;
    const canConfirm = agreed && (selectedPaymentMethod === "card" ? hasCard : selectedPaymentMethod !== null);

    const handleSelectCard = () => {
        if (user) {
            // logged in: if has card select, otherwise open card dialog to add
            if (hasCard) {
                setSelectedPaymentMethod("card");
            } else {
                setDialogOpen(true);
            }
        } else {
            // not logged in: show login then open card dialog afterwards
            setOpenCardAfterLogin(true);
            setOpenLoginDialog(true);
        }
    }

    const handleSubmit = () => {
        if (!canConfirm) {
            setError(!agreed ? "You must agree to terms." : "Select a payment method before confirming.");
            // If user is trying to confirm with card but not logged in or missing card, route them to login/card dialog
            if (selectedPaymentMethod === "card") {
                if (!user) {
                    setOpenCardAfterLogin(true);
                    setOpenLoginDialog(true);
                    return;
                }
                if (!hasCard) {
                    setDialogOpen(true);
                    return;
                }
            }
            return;
        }
        onConfirm();
    }

    return (
        <section>
            <h2 className="text-2xl font-semibold">Review & confirm</h2>
            <div className="mt-4 space-y-4">
                <div className="rounded-2xl border p-4">
                    <h3 className="font-semibold">Services</h3>
                    <ul className="mt-2 text-sm">
                        {items.map(({service, variant}) => (
                            <li key={`${service.id}-${variant.id}`} className="flex items-center justify-between py-1">
                                <span>
                                  {service.name} — {variant.name}
                                </span>
                                <span className="text-zinc-600 dark:text-zinc-400">${variant.price}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-2 text-sm text-muted-foreground">Duration: {durations} min</div>
                </div>

                <div className={"flex flex-col rounded-2xl border p-4 gap-2"}>
                    <h3 className={"font-semibold text-2xl"}>Payment Method</h3>
                    <div className={"flex items-center gap-2"}>
                        <Button
                            variant="outline"
                            onClick={handleSelectCard}
                            className={selectedPaymentMethod === "card" ? "ring-2 ring-purple-500 border-purple-500" : ""}
                        >
                            <MdPayments className="mr-2 h-4 w-4"/>
                            Pay with Credit Card
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedPaymentMethod("venue")}
                            className={selectedPaymentMethod === "venue" ? "ring-2 ring-purple-500 border-purple-500" : ""}
                        >
                            Pay at Venue
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedPaymentMethod("paypal")}
                            className={selectedPaymentMethod === "paypal" ? "ring-2 ring-purple-500 border-purple-500" : ""}
                        >
                            <FaPaypal className="mr-2 h-4 w-4"/>
                            Pay with PayPal
                        </Button>
                    </div>

                    {/* show small hint if card is selected but missing */}
                    {selectedPaymentMethod === "card" && !hasCard && (
                        <div className="mt-2 text-sm text-muted-foreground">No card on file — add one to pay with
                            card.</div>
                    )}
                </div>
                <DialogCardDetails
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSave={handleCardSave}
                />
                <div className={"flex flex-col gap-2"}>
                    <h3 className={"font-semibold text-2xl"}>Discount Code</h3>
                    <div className="flex gap-2">
                        <Input
                            className="flex-1"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Enter Discount Code"
                            type="text"
                            maxLength={6}
                        />
                        <Button
                            onClick={() => validateCode(code)}
                            variant="outline"
                            disabled={!code || appliedCode === code}
                        >
                            Apply
                        </Button>
                        {appliedCode && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setAppliedCode(null);
                                    setAppliedDiscount(0);
                                    setCode("");
                                    setError(null);
                                }}
                            >
                                Remove
                            </Button>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {appliedDiscount > 0 && (
                        <div className="mt-2 text-sm text-green-500">
                            <p>Code applied: {appliedCode} — Discount: -${appliedDiscount}</p>
                            <p>New total: ${finalTotal}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border p-4">
                    <h3 className="font-semibold">Schedule</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {selectedDate} at {selectedTime}
                    </p>
                </div>

                <div className={"flex flex-col gap-2"}>
                    <h3 className={"font-semibold text-2xl"}>
                        Cancellation policy
                    </h3>
                    <p className={"text-sm text-muted-foreground"}>
                        Please cancel at least 2 hours before appointment.
                    </p>
                </div>

                <div className={"flex flex-col gap-2"}>
                    <h3 className={"font-semibold text-2xl"}>
                        Important Information
                    </h3>
                    <h4 className="font-semibold mt-2">SALON POLICY</h4>
                    <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                        <li>No cancellations or changes allowed within 24 hours of the appointment.</li>
                        <li>A deposit of RM50 is required for selected services to secure your booking.</li>
                        <li>Deposits are non-refundable for no-shows or last-minute cancellations.</li>
                        <li>Cancellations/Rescheduling: We require at least 24 hours&#39; notice for changes or
                            cancellations, with a RM10 fee.
                        </li>
                        <li>Late arrivals may lead to shortened services or rescheduling, based on stylist
                            availability.
                        </li>
                        <li>Arriving 15-30 minutes late may result in cancellation, and deposits will not be
                            refunded. Rescheduling depends on availability.
                        </li>
                        <li>After twice last-minute cancellations or no-shows, prepayment may be required for future
                            bookings.
                        </li>
                        <li>We do not provide refunds for services.</li>
                        <li>We offer a complimentary adjustment within 7 days of the original appointment.</li>
                        <li>Children receiving services must exhibit appropriate behaviour.</li>
                        <li>We reserve the right to refuse services.</li>
                        <li>Salon not liable for lost or damaged items.</li>
                    </ol>
                </div>

                <div className="*:not-first:mt-2">
                    <Label className={"text-xl"}>Booking Note</Label>
                    <Textarea placeholder="Include comments or requests about your booking."
                              className={"min-h-[100px] w-xl"}/>
                </div>

                <div className="flex items-center mt-4 gap-2">
                    <Checkbox onClick={() => setAgreed(!agreed)} checked={agreed} id="terms" name="terms"/>
                    <Label className={"flex flex-row gap-2 items-center"}>
                        I agree to the <TermDialog/>
                    </Label>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button
                        className="px-8"
                        onClick={handleSubmit}
                        disabled={!canConfirm}
                    >
                        Confirm Booking • ${finalTotal}
                    </Button>
                </div>
            </div>
            <LoginDialog openLogin={openLoginDialog} onOpenChange={setOpenLoginDialog} />
        </section>
    );
}