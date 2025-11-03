import React from "react"
import {UseFormReturn} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

type FormValues = {
    email: string
    password: string
}

type View = "signIn" | "signUp" | "otp"

interface Props {
    id: string
    methods: UseFormReturn<FormValues>
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void
    loading: boolean
    rememberMe: boolean
    setRememberMe: (v: boolean) => void
    error: string | null
    setView: (v: View) => void
}

const SignInForm = ({id, methods, onSubmit, loading, rememberMe, setRememberMe, error, setView}: Props) => {
    const {register, formState: {errors}} = methods

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-4">
                <div className="*:not-first:mt-2">
                    <Label htmlFor={`${id}-email`}>Email</Label>
                    <Input
                        id={`${id}-email`}
                        placeholder="hi@yourcompany.com"
                        type="email"
                        {...register("email", {required: "Email is required"})}
                    />
                    {errors.email?.message && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="*:not-first:mt-2">
                    <Label htmlFor={`${id}-password`}>Password</Label>
                    <Input
                        id={`${id}-password`}
                        placeholder="Enter your password"
                        type="password"
                        {...register("password", {required: "Password is required"})}
                    />
                    {errors.password?.message && <p className="text-sm text-red-500">{errors.password.message}</p>}
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
                <button
                    type="button"
                    className="text-sm underline hover:no-underline"
                    onClick={() => setView("otp")}
                >
                    Login by OTP
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center">
                <span className="text-sm text-muted-foreground mr-2">Don&apos;t have an account?</span>
                <button type="button" className="text-sm underline hover:no-underline"
                        onClick={() => setView("signUp")}>
                    Sign up
                </button>
            </div>
        </form>
    )
}

export default SignInForm