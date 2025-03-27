import axios, { AxiosError } from "axios";
import { LoginUserDto, UserStoreState } from "@/interface/user.ts";
import { Result } from "@/interface/common.ts";

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
export function getUserData():Promise<Result<UserStoreState>> {
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
