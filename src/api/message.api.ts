import axios, { AxiosResponse } from "axios";

interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}

export interface Message {
    id: string;
    type: "event" | "system";
    content: string;
    is_read: boolean;
    created_at: Date;
}

export const getAllMessages = async () => {
    try {
        const response: AxiosResponse<ApiResponse<Message[]>> =
            await axios.get("/message/all");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "获取通知失败");
    }
};

export const readMessage = async (messageId: string) => {
    try {
        const response: AxiosResponse<ApiResponse<Message>> = await axios.put(
            `/message/read/${messageId}`,
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "标记已读失败");
    }
};
export const getUnreadCount = async () => {
    try {
        const response: AxiosResponse<ApiResponse<number>> = await axios.get(
            "/message/unread-count",
        );
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "获取未读消息失败");
    }
};
