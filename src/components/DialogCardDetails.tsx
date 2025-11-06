import { useState} from "react"


import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,

} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";

// type CardDetails = {
//     name?: string
//     number?: string
//     expiry?: string
//     cvc?: string
//     cardType?: string | null
// }

interface Props {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSave?: (paymentMethodId: string) => void
}

function luhnCheck(value: string) {
    const digits = value.replace(/\D/g, "")
    let sum = 0
    let shouldDouble = false
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits.charAt(i), 10)
        if (shouldDouble) {
            d *= 2
            if (d > 9) d -= 9
        }
        sum += d
        shouldDouble = !shouldDouble
    }
    return sum % 10 === 0 && digits.length > 0
}

function expectedLengthsForCard(cardType: string | null) {
    if (!cardType) return [13, 14, 15, 16, 19] // generic
    const t = cardType.toLowerCase()
    if (t.includes("amex") || t.includes("american")) return [15]
    if (t.includes("visa")) return [13, 16, 19]
    if (t.includes("mastercard") || t.includes("master")) return [16]
    if (t.includes("diners")) return [14]
    return [13, 14, 15, 16, 19]
}

function validateExpiry(raw: string) {
    const m = raw.replace(/\s/g, "");
    const parts = m.split("/")
    if (parts.length !== 2) return false
    const mm = parseInt(parts[0], 10)
    const yy = parseInt(parts[1], 10)
    if (Number.isNaN(mm) || Number.isNaN(yy)) return false
    if (mm < 1 || mm > 12) return false
    // convert two-digit year to full year (assume 2000-2099)
    const fullYear = yy < 100 ? 2000 + yy : yy
    const now = new Date()
    const exp = new Date(fullYear, mm, 1)
    // set to first day of next month and subtract 1ms to be at end of expiry month
    exp.setMonth(exp.getMonth())
    exp.setDate(1)
    // compare by year/month
    const nowYm = now.getFullYear() * 12 + now.getMonth()
    const expYm = fullYear * 12 + (mm - 1)
    return expYm >= nowYm
}

export default function DialogCardDetails({ open, onOpenChange, onSave }: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [name, setName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardComplete, setCardComplete] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !name.trim()) return;

        setIsProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: { name },
            });

            if (error) {
                setError(error.message || 'Payment failed');
            } else if (paymentMethod?.id) {
                onSave?.(paymentMethod.id);
                onOpenChange?.(false);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {/* Header giữ nguyên */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <Label>Name on card</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Card Element */}
                        <div>
                            <Label>Card details</Label>

                            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!stripe || isProcessing || !cardComplete || !name.trim()}
                    >
                        {isProcessing ? 'Processing...' : 'Save Card'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
