import axios, { AxiosResponse } from "axios";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { User } from "@/api/user.api.ts";

interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}

interface SearchItem {
    content: UserContent[],
    user: User[]
}

export const getSearch = async (keyword: string) => {
    try {
        const response: AxiosResponse<ApiResponse<SearchItem>> = await axios.get("/search/get-search?keyword=" + keyword);
        return response.data
    }catch (error){
        throw new Error(error.response?.data?.message || "搜索失败");
    }
};