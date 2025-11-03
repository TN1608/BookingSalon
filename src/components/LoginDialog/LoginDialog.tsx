"use client"
import {useId, useState} from "react"
import {useForm} from "react-hook-form"
import {AnimatePresence, motion} from "framer-motion"

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {toast} from "sonner"
import {useAuth} from "@/context/AuthProvider"
import {loginApi, registerApi} from "@/services/auth"
import {Form} from "@/components/ui/form"

import SignInForm from "./variants/SignInForm"
import SignUpForm from "./variants/SignUpForm"
import LoginByOtpForm from "./variants/LoginByOtpForm"

interface LoginDialogProps {
    openLogin: boolean;
    onOpenChange: (v: boolean) => void;
}

type SignInValues = {
    email: string;
    password: string;
}

type SignUpValues = {
    fullName: string;
    email: string;
    password: string;
    passwordConfirm?: string;
}

type View = "signIn" | "signUp" | "otp"

export default function LoginDialog({openLogin, onOpenChange}: LoginDialogProps) {
    const id = useId()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [view, setView] = useState<View>("signIn")

    const {login} = useAuth();
    const loginMethod = useForm<SignInValues>({defaultValues: {email: "", password: ""}})
    const signUpMethod = useForm<SignUpValues>({defaultValues: {email: "", password: "", fullName: ""}})
    const methods = view === "signIn" ? loginMethod : signUpMethod
    const {handleSubmit} = methods

    const onSubmit = async (values: SignInValues) => {
        setError(null)
        setLoading(true)

        try {
            const resp = await loginApi(values.email, values.password)
            await login(resp.data, rememberMe)
            toast("Login successful!")
            onOpenChange(false)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed"
            setError(msg)
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const onSignUp = async (values: SignUpValues) => {
        setError(null)
        setLoading(true)
        try {
            await registerApi(values.fullName, values.email, values.password)
            toast("Registration successful! Please log in.")
            setView("signIn")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Registration failed"
            setError(msg)
            toast.error(msg)
        } finally {
            setLoading(false)
        }
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

                <Form {...methods}>
                    <AnimatePresence mode="wait">
                        {view === "signIn" && (
                            <motion.div
                                key="signIn"
                                initial={{opacity: 0, y: 8}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -8}}
                                transition={{duration: 0.18}}
                            >
                                <SignInForm
                                    id={id}
                                    methods={methods}
                                    onSubmit={handleSubmit(onSubmit)}
                                    loading={loading}
                                    rememberMe={rememberMe}
                                    setRememberMe={setRememberMe}
                                    error={error}
                                    setView={setView}
                                />
                            </motion.div>
                        )}

                        {view === "otp" && (
                            <motion.div
                                key="otp"
                                initial={{opacity: 0, y: 8}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -8}}
                                transition={{duration: 0.18}}
                            >
                                <LoginByOtpForm setView={setView}/>
                            </motion.div>
                        )}

                        {view === "signUp" && (
                            <motion.div
                                key="signUp"
                                initial={{opacity: 0, y: 8}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -8}}
                                transition={{duration: 0.18}}
                            >
                                <SignUpForm
                                    onSubmit={handleSubmit(onSignUp)}
                                    methods={methods}
                                    loading={loading}
                                    setView={setView}/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Form>

                <div
                    className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    <span className="text-xs text-muted-foreground">Or</span>
                </div>

                <Button variant="outline">Login with Google</Button>
                <Button variant={"outline"} onClick={() => setView('otp')}>Login with OTP</Button>
            </DialogContent>
        </Dialog>
    )
}