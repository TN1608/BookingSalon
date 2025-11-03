import React from "react"
import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type View = "signIn" | "signUp" | "otp"

type FormValues = {
    fullName: string
    email: string
    password: string
    passwordConfirm?: string
}

interface Props {
    setView: (v: View) => void
    methods: UseFormReturn<any>
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void
    loading: boolean
}

const SignUpForm = ({ setView, methods, onSubmit, loading }: Props) => {
    const {
        register,
        watch,
        formState: { errors },
    } = methods

    const password = watch("password", "")

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-4 grid grid-cols-2 gap-4">
                <div className="*:not-first:mt-2">
                    <Label htmlFor="signup-fullname">Full name</Label>
                    <Input
                        id="signup-fullname"
                        placeholder="Jane Doe"
                        {...register("fullName", { required: "Full name is required" })}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="*:not-first:mt-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                        id="signup-email"
                        placeholder="hi@yourcompany.com"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="*:not-first:mt-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                        id="signup-password"
                        placeholder="Create a password"
                        type="password"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="*:not-first:mt-2">
                    <Label htmlFor="signup-password-confirm">Confirm password</Label>
                    <Input
                        id="signup-password-confirm"
                        placeholder="Repeat your password"
                        type="password"
                        {...register("passwordConfirm", {
                            required: "Please confirm your password",
                            validate: (value) => value === password || "Passwords do not match",
                        })}
                    />
                    {errors.passwordConfirm && <p className="text-sm text-red-500">{errors.passwordConfirm.message}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center">
                <span className="text-sm text-muted-foreground mr-2">Already have an account?</span>
                <button type="button" className="text-sm underline hover:no-underline" onClick={() => setView("signIn")}>
                    Sign in
                </button>
            </div>
        </form>
    )
}

export default SignUpForm