import {WaitlistEntry} from "@/types/types";
import api from "@/lib/axios";
import ApiResponse from "@/types/ApiResponse";
import {string} from "zod";

export type WaitlistServiceItem = {
    name: string;
    description?: string;
    quantity: number;
    price: number;
}
export type WaitlistPayload = {
    customer: string | undefined;
    stylist: { id: string; name?: string } | null;
    services: WaitlistServiceItem[];
    entry: WaitlistEntry[];
    total: number;
}

type waitlistEmailProps = {
    to: string | undefined;
    name: string | undefined;
    date: string;
    time: string;
    serviceName: string;
    staffName: string;
}



export const createWaitList = async (payload: WaitlistPayload): Promise<ApiResponse> => {
    try {
        const response = await api.post('/createWaitlist', payload);
        return response.data;
    } catch (err) {
        console.error('Error during registration:', err);
        throw new Error('Registration failed');
    }
}

export const sendEmailWaitlist = async ({to, name, date, time, serviceName, staffName}: waitlistEmailProps) => {
    try {
        await fetch('/api/send-waitlist-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, name, date, time, serviceName, staffName }),
        })
        return true;
    } catch (err) {
        console.error('Error during registration:', err);
        throw new Error('Registration failed');
    }
}