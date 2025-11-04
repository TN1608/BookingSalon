import ApiResponse from "@/types/ApiResponse";
import api from "@/lib/axios";
export type BookingServiceItem = {
    name: string;
    description?: string;
    quantity: number;
    price: number;
};

export type BookingPayload = {
    // userId?: string | null;
    userEmail?: string | null;
    // phone?: string | null;
    services: BookingServiceItem[];
    totalPrice: number;
    discountPercent?: number | null;
    startTime?: string | null;
    totalDuration?: number; // minutes
    stylist?: { id: string; name?: string } | null;
    notes?: string | null;
};

export const checkout = async (payload: BookingPayload): Promise<ApiResponse> => {
    try {
        const resp = await api.post("/checkout", payload);
        return resp.data;
    } catch (err: any) {
        console.error("Error during checkout:", err);
        throw new Error(err.response?.data?.message || "Checkout failed");
    }
};