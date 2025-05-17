import { Result } from "@/interface/common";
import axios, { AxiosError, AxiosResponse } from "axios";

export const interactionApi = {
    // 关注用户
    focusUser: async (userId: string) => {
        try {
            const response: AxiosResponse<Result<null>> = await axios.post(
                "/communityaction/toggle-focus-user",
                { userId },
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message);
        }
    },
    
};
