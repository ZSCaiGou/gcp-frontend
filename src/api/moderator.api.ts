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
export interface ModeratorCommunity {
    id: string;
    name: string;
    description: string;
}
export interface CommunityContent {
    id: string;
    title: string;
    content: string;
}

export const moderatorApi = {
    modGetManagedCommunities: async (): Promise<ModeratorCommunity[]> => {
        try {
            const response: AxiosResponse<ApiResponse<ModeratorCommunity[]>> =
                await axios.get("/moderator/get-managed-communities");

            return response.data.data;
        } catch (error) {
            throw new Error("获取管理的社区列表失败");
        }
    },

    getCommunityContents: async (
        communityId: string,
        params: {
            page: number;
            pageSize: number;
            status?: string[];
            type?: string[];
            search?: string;
            sortField?: string;
            sortOrder?: string;
        },
    ): Promise<PaginatedResponse<any>> => {
        try {
            const response: AxiosResponse<ApiResponse<PaginatedResponse<any>>> =
                await axios.get(
                    `/moderator/community/${communityId}/contents`,
                    {
                        params: {
                            ...params,
                            sortOrder:
                                params.sortOrder === "ascend" ? "asc" : "desc",
                            status: params.status?.join(","),
                            type: params.type?.join(","),
                        },
                    },
                );
            return response.data.data;
        } catch (error) {
            throw new Error("获取社区内容失败");
        }
    },

    reviewContent: async (
        contentId: string,
        action: "approve" | "reject",
    ): Promise<void> => {
        try {
            await axios.post(
                `/moderator/content/${contentId}/review`,
                {
                    action,
                },
            );
        } catch (error) {
            throw new Error(
                `内容审核${action === "approve" ? "通过" : "拒绝"}失败`,
            );
        }
    },
};
