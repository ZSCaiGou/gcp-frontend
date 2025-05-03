import axios, { AxiosResponse } from "axios";

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}
interface ModeratorCommunity {
    id: number;
    name: string;
    description: string;
}


export const moderatorApi = {
    modGetManagedCommunities: async (): Promise<ModeratorCommunity[]> => {
        try {
            const response: AxiosResponse<ApiResponse<ModeratorCommunity[]>> = 
                await axios.get("/game/moderator-get-managed-communities");
                
            return response.data.data;
        } catch (error) {
            throw new Error("获取管理的社区列表失败");  
        }
    }
}