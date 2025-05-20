import axios, { AxiosResponse } from "axios";

interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}

interface DownloadItem {
    id: string;
    name: string;
    version: string;
    size: string;
    url: string;
    type: "official" | "patch" | "mod";
}

export const uploadResource = async (formData: FormData) => {
    try {
        const response: AxiosResponse<ApiResponse<DownloadItem>> = await axios.post(
            "/resource/upload-resource",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "上传资源失败");
    }
};

export const getResources = async (gameId: string) => {
    try {
        const response: AxiosResponse<ApiResponse<DownloadItem[]>> =
            await axios.get(`/resource/get-resources/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "获取资源失败");
    }
};
