"use client"
import {useId, useState} from "react"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {toast} from "sonner";
import {useAuth} from "@/context/AuthProvider";

interface LoginDialogProps {
    openLogin: boolean;
    onOpenChange: (v: boolean) => void;
}

export default function LoginDialog({openLogin, onOpenChange}: LoginDialogProps) {
    const id = useId()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const {login} = useAuth();

    const user = {
        fullName: "Tuan",
        email: "tuan.skipli@gmail.com",
        password: "123",
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        await new Promise((r) => setTimeout(r, 500))

        if (email === user.email && password === user.password) {
            login({fullName: user.fullName, email: user.email}, rememberMe)
            toast("Login successful!")
            onOpenChange(false)
        } else {
            setError("Invalid email or password")
        }

        setLoading(false)
    }

    return (
        <Dialog open={openLogin} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                    >
                        <svg
                            className="stroke-zinc-800 dark:stroke-zinc-100"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 32 32"
                            aria-hidden="true"
                        >
                            <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8"/>
                        </svg>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Continue to Salona Booking</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Ready for your next beauty session? Sign in to your account to get started.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-email`}>Email</Label>
                            <Input
                                id={`${id}-email`}
                                placeholder="hi@yourcompany.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null)
                                }}
                            />
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-password`}>Password</Label>
                            <Input
                                id={`${id}-password`}
                                placeholder="Enter your password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null)
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={`${id}-remember`}
                                checked={rememberMe}
                                onCheckedChange={(v) => setRememberMe(Boolean(v))}
                            />
                            <Label
                                htmlFor={`${id}-remember`}
                                className="font-normal text-muted-foreground"
                            >
                                Remember me
                            </Label>
                        </div>
                        <a className="text-sm underline hover:no-underline" href="#">
                            Forgot password?
                        </a>
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <div
                    className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    <span className="text-xs text-muted-foreground">Or</span>
                </div>

                <Button variant="outline">Login with Google</Button>
            </DialogContent>
        </Dialog>
    )
}
