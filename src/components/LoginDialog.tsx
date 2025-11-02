"use client"
import {useId, useState} from "react"
import {useForm} from "react-hook-form"

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
import {toast} from "sonner";
import {useAuth} from "@/context/AuthProvider";
import {loginApi} from "@/services/auth";
import {Form} from "@/components/ui/form";

interface LoginDialogProps {
    openLogin: boolean;
    onOpenChange: (v: boolean) => void;
}

type FormValues = {
    email: string;
    password: string;
}

export default function LoginDialog({openLogin, onOpenChange}: LoginDialogProps) {
    const id = useId()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const {login} = useAuth();
    const methods = useForm<FormValues>({ defaultValues: { email: "", password: "" } })
    const { register, handleSubmit, formState: { errors } } = methods

    const onSubmit = async (values: FormValues) => {
        setError(null)
        setLoading(true)

        try {
            const resp = await loginApi(values.email, values.password)

            // try several common token locations
            const token =
                (resp as any)?.data?.token ??
                (resp as any)?.token ??
                (resp as any)?.data?.accessToken ??
                (resp as any)?.accessToken

            if (!token) {
                const msg = (resp as any)?.message ?? "Authentication failed"
                setError(msg)
                toast.error(msg)
                setLoading(false)
                return
            }

            await login(token, rememberMe)
            toast("Login successful!")
            onOpenChange(false)
        } catch (err: any) {
            const msg = err?.message ?? "Login failed"
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
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-4">
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={`${id}-email`}>Email</Label>
                                <Input
                                    id={`${id}-email`}
                                    placeholder="hi@yourcompany.com"
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={`${id}-password`}>Password</Label>
                                <Input
                                    id={`${id}-password`}
                                    placeholder="Enter your password"
                                    type="password"
                                    {...register("password", { required: "Password is required" })}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
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
                </Form>

                <div
                    className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    <span className="text-xs text-muted-foreground">Or</span>
                </div>

                <Button variant="outline">Login with Google</Button>
            </DialogContent>
        </Dialog>
    )
}
