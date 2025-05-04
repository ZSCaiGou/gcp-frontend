import axios, { AxiosError, AxiosResponse } from "axios";
import { LoginUserDto, UserStoreState } from "@/interface/user.ts";
import { Result } from "@/interface/common.ts";
import { FormValue } from "@/pages/Home/HomePersonal";
import { UserContent } from "@/Entity/user_content.entity.ts";

// 登录
export function loginUser(data: LoginUserDto): Promise<unknown> {
    return new Promise((resolve, reject) => {
        axios
            .post("/user/login", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 获取验证码
export function getVerifyCode(email: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/getVerifyCode?email=" + email)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 获取用户信息
export function getUserData(): Promise<Result<UserStoreState>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/userdata")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 更新用户信息
export function updateUserProfile(data: FormValue): Promise<Result<null>> {
    return new Promise((resolve, reject) => {
        axios
            .put("/user/userprofile", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 更新用户头像
export function updateUserAvatar(data: FormData): Promise<Result<null>> {
    return new Promise((resolve, reject) => {
        axios
            .post("/user/useravatar", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 获取用户动态
export function getUserDynamic(userId: string): Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/dynamic/" + userId)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 获取用户上传
export function getUserUpload(userId: string): Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/upload/" + userId)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

export function getUserById(userId: string): Promise<Result<UserStoreState>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/get-user-by-id/" + userId)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 类型定义
export interface User {
    id: string;
    username: string;
    email: string;
    role: "ADMIN" | "MODERATOR" | "USER" | "SUPER_ADMIN";
    status: "active" | "disabled";
    create_time: string;
    last_login_time?: string;
    managed_communities?: Community[];
}

export interface Community {
    id: string;
    key: string;
    title: string;
    description: string;
}

// 扩展用户查询参数接口
export interface UserQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    roles?: ("admin" | "moderator" | "user")[];
    status?: ("active" | "disabled")[];
    sortField?: string;
    sortOrder?: "ascend" | "descend";
}

// 扩展API响应接口
interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

const api = {
    loginUser,
    getVerifyCode,
    getUserData,
    updateUserProfile,
    updateUserAvatar,
    getUserDynamic,
    getUserUpload,
    // 分页查询用户
    getUsersWithPagination: async (
        params: UserQueryParams,
    ): Promise<PaginatedResponse<User>> => {
        try {
            const response: AxiosResponse<Result<PaginatedResponse<User>>> =
                await axios.get("/user/admin-users-paginated", {
                    params: {
                        page: params.page,
                        pageSize: params.pageSize,
                        search: params.search,
                        roles: params.roles?.join(","),
                        status: params.status?.join(","),
                        sortField: params.sortField,
                        sortOrder:
                            params.sortOrder === "ascend" ? "asc" : "desc",
                    },
                });
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            throw new Error("获取用户列表失败");
        }
    },
    // 创建用户
    createUser: async (
        userData: Omit<User, "id" | "created_time">,
    ): Promise<User> => {
        try {
            const response: AxiosResponse<Result<User>> = await axios.post(
                "/user/admin-add-user",
                userData,
            );
            return response.data.data;
        } catch (error) {
            throw new Error("创建用户失败");
        }
    },

    // 更新用户
    updateUser: async (
        userId: string,
        userData: Partial<User>,
    ): Promise<User> => {
        try {
            const response: AxiosResponse<Result<User>> = await axios.put(
                `/user/admin-user/${userId}`,
                userData,
            );
            return response.data.data;
        } catch (error) {
            throw new Error("更新用户失败");
        }
    },

    // 删除用户
    deleteUser: async (userIds: string[]): Promise<void> => {
        try {
            await axios.patch(`/user/admin-delete-user`, { userIds });
        } catch (error) {
            throw new Error("删除用户失败");
        }
    },

    // 批量操作用户状态
    batchUpdateUserStatus: async (
        userIds: string[],
        status: "active" | "disabled",
    ): Promise<void> => {
        try {
            await axios.patch("/user/admin-change-user-status", {
                userIds,
                status,
            });
        } catch (error) {
            throw new Error("批量更新用户状态失败");
        }
    },

    // 获取所有社区
    getCommunities: async (): Promise<Community[]> => {
        try {
            const response: AxiosResponse<Result<Community[]>> =
                await axios.get("/game/admin-communities");
            return response.data.data.map(
                (item) => ({ ...item, key: item.id }) as Community,
            );
        } catch (error) {
            throw new Error("获取社区列表失败");
        }
    },

    // 重置密码
    resetPassword: async (userId: string): Promise<void> => {
        try {
            await axios.post(`/users/${userId}/reset-password`);
        } catch (error) {
            throw new Error("重置密码失败");
        }
    },
};
export const userApi = api;
