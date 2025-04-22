import axios, { AxiosError } from "axios";
import { UserContent, UserContentComment } from "@/Entity/user_content.entity.ts";
import { Result } from "@/interface/common.ts";

export function getReplies(commentId: string):Promise<Result<UserContentComment[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/comment/get-replies?comment_id=" + commentId)
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}


export function likeComment( commentId:string) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/like-comment")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}


export function addComment(contentId: string, content: string, parentId?: string):Promise<Result<UserContentComment>> {
    return new Promise((resolve, reject) => {
        axios
            .post("/comment/add-comment",{
                target_content_id:contentId,
                content,
                parent_id:parentId
            })
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });

}


export function shareContent(s: string) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/share-content")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}


export function favoriteContent(s: string) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/favorite-content")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}


export function likeContent(s: string) {
    return new Promise((resolve, reject) => {
        axios
            .post("/user-content/like-content")
            .then((res) => {
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                return reject(err.response.data);
            });
    });
}


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

