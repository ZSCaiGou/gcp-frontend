import axios, { AxiosError } from "axios";
import { UserContent } from "@/Entity/user_content.entity.ts";

export function savePostContentAsDraft(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/post-draft",data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

export function savePostContent(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/post-content",data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}

export function saveUploadContent(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/upload-content",data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
export function  saveUploadContentAsDraft(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/upload-draft",data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
export function saveNewsContent(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/news-content",data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
export function saveNewsContentAsDraft(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/news-draft",data)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}
