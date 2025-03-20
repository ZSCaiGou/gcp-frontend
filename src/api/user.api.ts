import axios, { AxiosError } from "axios";
import { LoginUserDto } from "@/interface/user.ts";

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

export function getVerfyCode(phone: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user/getVerfyCode?phone=" + phone)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}
