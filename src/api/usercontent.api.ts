import axios, { AxiosError } from "axios";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { Result } from "@/interface/common.ts";

// 保持动态为草稿
export function savePostContentAsDraft(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/post-draft", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 发布动态
export function savePostContent(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/post-content", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 发布投稿
export function saveUploadContent(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/post-content", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 保存投稿为草稿
export function saveUploadContentAsDraft(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/post-draft", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 发布新闻
export function saveNewsContent(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/news-content", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 保存新闻为草稿
export function saveNewsContentAsDraft(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/news-draft", data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
// 获取主页列表
export function getMainUserContentList():Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user-content/main-user-content")
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

// 通过id获取用户内容详情
export function getUserContentById(id: string):Promise<Result<UserContent | null>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/user-content/get-content?id=" + id)
            .then((res) => {

                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

