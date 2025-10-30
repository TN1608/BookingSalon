import {useId, useRef, useEffect, useState} from "react"
import {CreditCardIcon, WalletIcon} from "lucide-react"
import {usePaymentInputs} from "react-payment-inputs"
import images, {type CardImages} from "react-payment-inputs/images"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {FaCcVisa, FaCcMastercard, FaCcAmex, FaCreditCard} from "react-icons/fa"

type CardDetails = {
    name?: string
    number?: string
    expiry?: string
    cvc?: string
    cardType?: string | null
}

interface Props {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSave?: (card: CardDetails) => void
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

export default function DialogCardDetails({open, onOpenChange, onSave}: Props) {
    const id = useId()
    const formRef = useRef<HTMLFormElement | null>(null)
    const {
        meta,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps,
        getCardImageProps,
    } = usePaymentInputs()

    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvc, setCvc] = useState("")
    const [cardType, setCardType] = useState<string | null>(null)

    const [errors, setErrors] = useState<{ name?: string; number?: string; expiry?: string; cvc?: string }>({})

    useEffect(() => {
        // react-payment-inputs updates meta.cardType
        setCardType(meta.cardType?.type ?? null)
    }, [meta.cardType])

    useEffect(() => {
        // run validations as user types
        const errs: typeof errors = {}
        if (!name.trim()) errs.name = "Name is required."
        // number validation
        const digits = number.replace(/\D/g, "")
        const expected = expectedLengthsForCard(cardType)
        if (!digits) {
            errs.number = "Card number is required."
        } else if (!expected.includes(digits.length)) {
            errs.number = `Card number should be ${expected.join(" or ")} digits.`
        } else if (!luhnCheck(digits)) {
            errs.number = "Invalid card number."
        }
        // expiry
        if (!expiry.trim()) {
            errs.expiry = "Expiry required."
        } else if (!validateExpiry(expiry)) {
            errs.expiry = "Invalid expiry date."
        }
        // cvc
        const isAmex = (cardType ?? "").toLowerCase().includes("amex") || Number.isNaN(Number(cardType)) && /amex/i.test(cardType ?? "")
        const cvcDigits = cvc.replace(/\D/g, "")
        const requiredCvcLen = isAmex ? 4 : 3
        if (!cvcDigits) {
            errs.cvc = "CVC required."
        } else if (cvcDigits.length !== requiredCvcLen) {
            errs.cvc = `CVC must be ${requiredCvcLen} digits.`
        }
        setErrors(errs)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, number, expiry, cvc, cardType])

    const isValid = Object.keys(errors).length === 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // final validation guard
        if (!isValid) return
        const card: CardDetails = {
            name: name.trim(),
            number: number.trim(),
            expiry: expiry.trim(),
            cvc: cvc.trim(),
            cardType: cardType ?? null,
        }
        onSave?.(card)
        onOpenChange?.(false)
        // clear local fields (optional)
        setName("")
        setNumber("")
        setExpiry("")
        setCvc("")
    }

    // wrap props from usePaymentInputs to also update local state
    const cardNumberProps = getCardNumberProps({
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value),
        onBlur: () => { /* let meta handle */
        },
    })
    const expiryProps = getExpiryDateProps({
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExpiry(e.target.value),
    })
    const cvcProps = getCVCProps({
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCvc(e.target.value),
    })

    const brandIcon = () => {
        const t = (cardType ?? "").toLowerCase()
        if (t.includes("visa")) return <FaCcVisa className="text-emerald-600" size={18}/>
        if (t.includes("master") || t.includes("mastercard")) return <FaCcMastercard className="text-orange-600"
                                                                                     size={18}/>
        if (t.includes("amex") || t.includes("american")) return <FaCcAmex className="text-blue-600" size={18}/>
        return <FaCreditCard size={16}/>
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="flex flex-col gap-2">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                    >
                        <WalletIcon className="opacity-80" size={16}/>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-left">Update your card</DialogTitle>
                        <DialogDescription className="text-left">
                            Your new card will replace your current card.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`name-${id}`}>Name on card</Label>
                            <Input id={`name-${id}`} type="text" required value={name}
                                   onChange={(e) => setName(e.target.value)}/>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`number-${id}`}>Card Number</Label>
                            <div className="relative">
                                <Input
                                    {...cardNumberProps}
                                    id={`number-${id}`}
                                    className="peer pe-9 [direction:inherit]"
                                />
                                <div
                                    className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                    {meta.cardType ? (
                                        <svg
                                            className="overflow-hidden rounded-sm"
                                            {...getCardImageProps({
                                                images: images as unknown as CardImages,
                                            })}
                                            width={20}
                                        />
                                    ) : (
                                        brandIcon()
                                    )}
                                </div>
                            </div>
                            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor={`expiry-${id}`}>Expiry date</Label>
                                <Input
                                    className="[direction:inherit]"
                                    {...expiryProps}
                                    id={`expiry-${id}`}
                                />
                                {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor={`cvc-${id}`}>CVC</Label>
                                <Input
                                    className="[direction:inherit]"
                                    {...cvcProps}
                                    id={`cvc-${id}`}
                                />
                                {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id={`primary-${id}`}/>
                        <Label
                            htmlFor={`primary-${id}`}
                            className="font-normal text-muted-foreground"
                        >
                            Set as default payment method
                        </Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={!isValid}>
                        Update card
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
