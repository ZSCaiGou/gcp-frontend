import axios, { AxiosError } from "axios";
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
export function getVerifyCode(phone: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/getVerifyCode?phone=" + phone)
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
export function getUserDynamic(): Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/dynamic")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
// 获取用户上传
export function getUserUpload(): Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/upload")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}
