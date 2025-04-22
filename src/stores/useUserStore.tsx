import { create } from "zustand/react";
import { UserStoreState } from "@/interface/user.ts";
import { getUserData } from "@/api/user.api.ts";
import { message } from "antd";

interface UserState {
    // 用户信息
    user: UserStoreState;
    // 用户id
    user_id: string;
    // 是否已登录
    isLogin: boolean;
    // 用户token
    token: string;
    // 初始化用户信息
    initUser: () => Promise<boolean>;
    // 刷新用户信息
    refreshUser: () => Promise<boolean>;

    logout(): void;
}

// 创建用户状态管理
const useUserStore = create<UserState>()((set, get) => ({
    user: null,
    user_id: null,
    isLogin: false,
    token: null,

    initUser: async () => {
        // store中存在token，则直接获取用户信息
        if (!get().token) {
            const token = localStorage.getItem("token");
            if (token) {
                // 设置token
                set({ token });
            } else {
                return false;
            }
        }

        // 获取用户信息
        try {
            // 获取用户信息
            const resData = await getUserData();
            set({ user: resData.data });
            // 成功获取用户信息后设置为已登录状态
            set({ isLogin: true });
            return true;
        } catch (error) {
            message.error(error.message);
            message.error("登录过期，请重新登录！");
            localStorage.removeItem("token");
            set({ isLogin: false, token: null, user_id: null, user: null });
            return false;
        }
    },
    refreshUser: async () => {
        // 判断是否已经初始化
        if (get().user && get().user_id && get().token && get().isLogin) {
            // 任何一个数据出现异常，则认为用户未登录
            const resData = await getUserData();
            set({ user: resData.data });
            return true;
        } else {
            // 重新初始化用户信息
            return await get().initUser();
        }
    },
    logout() {
        // 清除token
        localStorage.removeItem("token");
        // 重置用户信息
        set({ isLogin: false, token: null, user_id: null, user: null });
        message.success("退出登录");
    },
}));

export default useUserStore;
