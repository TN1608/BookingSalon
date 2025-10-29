"use client"
import {FaCheckCircle} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {useEffect} from "react";

const SuccessPage = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/'
        }, 3000)

        return () => clearTimeout(timer)
    })

    return (
        <div
            className="w-full min-h-screen flex flex-col items-center justify-center space-y-6 ">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#00c805] dark:bg-[#24b868]">
                <FaCheckCircle className="w-12 h-12 text-white"/>
            </div>
            <h2 className="text-3xl font-bold text-center text-[#32325d] dark:text-white">Booking Successful!</h2>
            <p className="text-lg text-center text-[#434678] dark:text-[#a3b7c3]">
                Your appointment has been booked successfully. We look forward to seeing you!
            </p>
            <p className="text-lg text-center text-[#434678] dark:text-[#a3b7c3]">
                You're being redirected to the homepage...
            </p>
            <Button variant="secondary"
                    onClick={() => window.location.href = '/'}
            >
                Click here to go back to the homepage
            </Button>
        </div>
    )
}

export default SuccessPage;