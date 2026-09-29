import { AxiosResponse } from "axios"
import { toast } from "react-toastify";

export const api = async <T,>(call: Promise<AxiosResponse<T>>): Promise<T> => {
    try {
        const response = await call;
        return response.data;
    } catch (error: any) {
        if (error?.response?.status !== 401) {
            const data = error?.response?.data;
            const message = data?.details
                ? Object.values(data.details).join(". ")
                : data?.error ?? data?.message ?? error?.message ?? "Request failed";
            toast.error(message);
        }
        throw error;
    }
}
