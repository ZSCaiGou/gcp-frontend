import axios, { AxiosResponse } from "axios";

interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}

export interface VerifyCodeParams {
    type: 'phone' | 'email';
    account: string;
}

export interface UpdatePhoneParams {
    originalPhone?: string;
    newPhone: string;
    code: string;
}

export interface UpdateEmailParams {
    originalEmail?: string;
    newEmail: string;
    code: string;
}

export interface UpdatePasswordParams {
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string;
    code?: string;
}

export interface UpdateUsernameParams {
    newUsername: string;
}

export const safeApi = {
    // 发送验证码
    sendVerifyCode: async (params: VerifyCodeParams): Promise<ApiResponse<null>> => {
        try {
            const response: AxiosResponse<ApiResponse<null>> = await axios.post(
                '/safe/send-verify-code',
                params
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "发送验证码失败");
        }
    },

    // 修改手机号
    updatePhone: async (params: UpdatePhoneParams): Promise<ApiResponse<null>> => {
        try {
            const response: AxiosResponse<ApiResponse<null>> = await axios.post(
                '/safe/update-phone',
                params
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "修改手机号失败");
        }
    },

    // 修改邮箱
    updateEmail: async (params: UpdateEmailParams): Promise<ApiResponse<null>> => {
        try {
            const response: AxiosResponse<ApiResponse<null>> = await axios.post(
                '/safe/update-email',
                params
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "修改邮箱失败");
        }
    },

    // 修改密码
    updatePassword: async (params: UpdatePasswordParams): Promise<ApiResponse<null>> => {
        try {
            const response: AxiosResponse<ApiResponse<null>> = await axios.post(
                '/safe/update-password',
                params
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "修改密码失败");
        }
    },
    
    // 修改用户名
    updateUsername: async (params: UpdateUsernameParams): Promise<ApiResponse<null>> => {
        try {
            const response: AxiosResponse<ApiResponse<null>> = await axios.post(
                '/safe/update-username',
                {
                    newUsername: params.newUsername
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "修改用户名失败");
        }
    }
};