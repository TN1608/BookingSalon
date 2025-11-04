"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointment_id");
    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!appointmentId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStatus("error");
            return;
        }

        const eventSource = new EventSource(
            `http://localhost:8080/api/sse/appointments/${appointmentId}`
        );

        // PHẢI DÙNG addEventListener VỚI TÊN EVENT
        const handler = (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);
                console.log("SSE received:", data); // DEBUG
                if (data.status === "confirmed") {
                    setStatus("success");
                    eventSource.close();
                }
            } catch (err) {
                console.error("Parse error:", err);
            }
        };

        eventSource.addEventListener("appointment.update", handler);

        eventSource.onerror = () => {
            console.error("SSE error");
            setStatus("error");
            eventSource.close();
        };

        return () => {
            eventSource.removeEventListener("appointment.update", handler);
            eventSource.close();
        };
    }, [appointmentId]);

    // Redirect sau 3s
    useEffect(() => {
        if (status === "success") {
            const t = setTimeout(() => (window.location.href = "/"), 3000);
            return () => clearTimeout(t);
        }
    }, [status]);

    if (status === "loading")
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <FaSpinner className="animate-spin text-6xl text-green-500" />
                <p className="text-xl">Confirming your payment...</p>
            </div>
        );

    if (status === "error")
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <p className="text-red-500">Connection failed. Please refresh.</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-5xl" />
            </div>
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p>Redirecting to homepage in 3s...</p>
            <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
        </div>
    );
}