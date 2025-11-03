import api from "@/lib/axios";
import ApiResponse from "@/types/ApiResponse";

export const getUserInfo = async (): Promise<ApiResponse> => {
    try{
        const response = await api.get('/getUser')
        return response.data;
    }catch (err){
        console.error('Error fetching user:', err);
        throw new Error('Failed to fetch user');
    }
}

export const registerApi = async (fullName: string, email: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await api.post('/signup', { fullName, email, password });
        return response.data;
    } catch (err) {
        console.error('Error during registration:', err);
        throw new Error('Registration failed');
    }
}

export const loginApi = async (email: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await api.post('/signin', { email, password });
        return response.data;
    } catch (err) {
        console.error('Error during login:', err);
        throw new Error('Login failed');
    }
}