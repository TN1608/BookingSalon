import React from "react"
import { Button } from "@/components/ui/button"

type View = "signIn" | "signUp" | "otp"

interface Props {
    setView: (v: View) => void
}

const LoginByOtpForm = ({ setView }: Props) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Login with OTP</h3>
            <p className="text-sm text-muted-foreground">Enter your phone or email to receive a one-time code.</p>

            {/* Placeholder inputs / logic can be added here */}
            <div className="flex gap-2">
                <Button onClick={() => setView("signIn")}>Back</Button>
                <Button variant="outline" onClick={() => setView("signUp")}>Sign up</Button>
            </div>
        </div>
    )
}

export default LoginByOtpForm
