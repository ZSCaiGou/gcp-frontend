import axios from "axios";
import type { AxiosResponse } from "axios";
import { Result } from "@/interface/common.ts";

// 类型定义
export interface AdminCommunity {
    id: string;
    title: string;
    description?: string;
    category: string[];
    status: "active" | "disabled";
    moderator_count: number;
    member_count: number;
    created_at: string;
    last_updated_at?: string;
    game_img_url?: string;
}

export interface CommunityQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    categories?: string[];
    status?: ("active" | "disabled")[];
    sortField?: string;
    sortOrder?: "ascend" | "descend";
}
export interface FollowCommunityParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ("active" | "disabled")[];
    sortField?: string;
    sortOrder?: "ascend" | "descend";
}
export interface Category {
    id: string;
    name: string;
    label: string;
    value: string;
}

export interface Moderator {
    id: string;
    username: string;
    role:  "moderator";
    addedAt: string;
    avatar_url?: string;
}


interface StatsData {
    memberCount: number;
    moderatorCount: number;
    postCount: number;
    commentCount: number;
    dailyActiveUsers: number;
    weeklyGrowthRate: number;
    memberActivity: Array<{ date: string; count: number }>;
    postActivity: Array<{ date: string; count: number }>;
    memberDistribution: Array<{ type: string; value: number }>;
}

interface User {
    id: string;
    username: string;
    avatar?: string;
}

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

export interface Member {
    id: string;
    username: string;
    email: string;
    joinTime: string;
    status: "active" | "disabled";
}
export interface UserSearchResult {
    id: string;
    username: string;
    avatar_url?: string;
    email: string;
}

// 社区相关API
export interface ModeratorRequest {
    id: string;
    username: string;
    community: string;
    status: "pending" | "approved" | "rejected";
}

export interface ModeratorRequestQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ("pending" | "approved" | "rejected")[];
    sortField?: string;
    sortOrder?: "ascend" | "descend";
}

export const communityApi = {
    // 分页查询社区
    getCommunities: async (
        params: CommunityQueryParams,
    ): Promise<PaginatedResponse<AdminCommunity>> => {
        try {
            const response: AxiosResponse<
                ApiResponse<PaginatedResponse<AdminCommunity>>
            > = await axios.get("/game/admin-communities-paginated", {
                params: {
                    page: params.page,
                    pageSize: params.pageSize,
                    search: params.search,
                    categories: params.categories?.join(","),
                    status: params.status?.join(","),
                    sortField: params.sortField,
                    sortOrder: params.sortOrder === "ascend" ? "asc" : "desc",
                },
            });

            return response.data.data;
        } catch (error) {
            throw new Error("获取社区列表失败");
        }
    },

    // 创建社区
    createCommunity: async (
        data: Omit<
            AdminCommunity,
            "id" | "moderatorCount" | "memberCount" | "created_at"
        >,
    ): Promise<AdminCommunity> => {
        try {
            const response: AxiosResponse<ApiResponse<AdminCommunity>> =
                await axios.post("/game/admin-create-community", data);
            return response.data.data;
        } catch (error) {
            throw new Error("创建社区失败");
        }
    },

    // 更新社区
    updateCommunity: async (
        id: string,
        data: Partial<AdminCommunity>,
    ): Promise<AdminCommunity> => {
        try {
            console.log(data);
            const response: AxiosResponse<ApiResponse<AdminCommunity>> =
                await axios.patch(`/game/admin-update-community/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw new Error("更新社区失败");
        }
    },

    // 批量更新社区状态
    batchUpdateStatus: async (
        ids: string[],
        status: "active" | "disabled",
    ): Promise<void> => {
        try {
            await axios.patch("/game/admin-change-community-status", {
                community_ids:ids,
                status,
            });
        } catch (error) {
            throw new Error("批量更新状态失败");
        }
    },

    // 批量删除社区
    batchDelete: async (ids: string[]): Promise<void> => {
        try {
            await axios.patch("/game/admin-delete-community", { community_ids: ids });
        } catch (error) {
            throw new Error("批量删除失败");
        }
    },

    // 获取社区版主列表
    getModerators: async (communityId: string): Promise<Moderator[]> => {
        try {
            const response: AxiosResponse<ApiResponse<Moderator[]>> =
                await axios.get(`/game/admin-get-moderators/${communityId}`);
            return response.data.data;
        } catch (error) {
            throw new Error("获取版主列表失败");
        }
    },

    // 搜索用户
    searchUser: async (searchTerm: string): Promise<User> => {
        try {
            const response: AxiosResponse<ApiResponse<User>> = await axios.get(
                "/users/search",
                {
                    params: { q: searchTerm },
                },
            );
            return response.data.data;
        } catch (error) {
            throw new Error("搜索用户失败");
        }
    },

    // 添加版主
    addModerator: async (
        communityId: string,
        userId: string,
    ): Promise<Moderator> => {
        try {
            const response: AxiosResponse<ApiResponse<Moderator>> =
                await axios.post(`/user/admin-add-moderator`, {
                    user_id: userId,
                    community_id: communityId,
                });
            return response.data.data;
        } catch (error) {
            throw new Error("添加版主失败");
        }
    },

    // 移除版主
    removeModerator: async (
        communityId: string,
        moderatorId: string,
    ): Promise<void> => {
        try {
            await axios.patch(
                `/user/admin-delete-moderator`,
                {
                    user_id: moderatorId,
                    community_id: communityId,
                }
            );
        } catch (error) {
            throw new Error("移除版主失败");
        }
    },

    // 获取社区统计数据
    getCommunityStats: async (
        communityId: string,
        params: {
            startDate: string;
            endDate: string;
        },
    ): Promise<StatsData> => {
        try {
            const response: AxiosResponse<ApiResponse<StatsData>> =
                await axios.get(`/communities/${communityId}/stats`, {
                    params,
                });
            return response.data.data;
        } catch (error) {
            throw new Error("获取统计信息失败");
        }
    },

    // 导出社区数据
    exportCommunityData: async (communityId: string): Promise<Blob> => {
        try {
            const response = await axios.get(
                `/communities/${communityId}/export`,
                {
                    responseType: "blob",
                },
            );
            return response.data;
        } catch (error) {
            throw new Error("导出数据失败");
        }
    },
    // 获取社区分类
    getCommunityCategories: async (): Promise<Category[]> => {
        try {
            const response: AxiosResponse<ApiResponse<Category[]>> =
                await axios.get("/game/game-category");
            return response.data.data;
        } catch (error) {
            throw new Error("获取社区分类失败");
        }
    },
    // 获取社区关注成员
    getCommunityMembers: async (
        communityId: string,
        params: FollowCommunityParams
    ): Promise<PaginatedResponse<Member>> => {
        try {
            const response: AxiosResponse<
                ApiResponse<PaginatedResponse<Member>>
            > = await axios.get(`/game/admin-get-community-followers/${communityId}`, {
                params: {
                    page: params.page,
                    pageSize: params.pageSize,
                    search: params.search,
                    status: params.status?.join(","),
                    sortField: params.sortField,
                    sortOrder: params.sortOrder === "ascend" ? "asc" : "desc",
                },
            });
            return response.data.data;
        } catch (error) {
            throw new Error("获取社区关注成员失败");
        }
    },
    searchUsers: async (searchTerm: string): Promise<UserSearchResult[]> => {
        try {
            const response: AxiosResponse<ApiResponse<UserSearchResult[]>> = await axios.get(
                "/user/admin-search-user",
                {
                    params: { search: searchTerm },
                },
            );
            return response.data.data;
        } catch (error) {
            throw new Error("搜索用户失败");
        }
    },

    // 获取版主申请列表
    getModeratorRequests: async (
        params: ModeratorRequestQueryParams,
    ): Promise<PaginatedResponse<ModeratorRequest>> => {
        try {
            const response: AxiosResponse<ApiResponse<PaginatedResponse<ModeratorRequest>>> = 
                await axios.get("/game/admin-get-moderator-requests", {
                    params: {
                        page: params.page,
                        pageSize: params.pageSize,
                        search: params.search,
                        status: params.status?.join(","),
                        sortField: params.sortField,
                        sortOrder: params.sortOrder === "ascend" ? "asc" : "desc",
                    },
                });
            return response.data.data;
        } catch (error) {
            throw new Error("获取版主申请列表失败");
        }
    },

    // 处理版主申请
    handleModeratorRequest: async (
        requestId: string, 
        action: "approved" | "rejected"
    ): Promise<void> => {
        try {
            await axios.patch("/game/admin-handle-moderator-request", {
                request_id: requestId,
                status: action,
            });
        } catch (error) {
            throw new Error("处理版主申请失败");
        }
    }
};
