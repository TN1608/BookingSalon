import ApiResponse from "@/types/ApiResponse";
import api from "@/lib/axios";

export const checkout = async (lineItems: any): Promise<ApiResponse> => {
    try {
        const resp = await api.post('/checkout', {lineItems});
        return resp.data;
    } catch (err: any) {
        console.error('Error during checkout:', err);
        throw new Error(err.response?.data?.message || 'Checkout failed');
    }
}