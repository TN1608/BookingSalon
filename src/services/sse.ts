import ApiResponse from "@/types/ApiResponse";
import api from "@/lib/axios";

export const connectSSE = async (appointmentId: string): Promise<ApiResponse> => {
    try{
        const response = await api.get(`/sse/appointments/${appointmentId}`);
        return response.data;
    }catch (err) {
        console.error('Error during SSE connection:', err);
        throw new Error('SSE connection failed');
    }
}