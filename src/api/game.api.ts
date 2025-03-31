import axios, { AxiosError } from "axios";
import { Game } from "@/Entity/game.entity.ts";
import { Result } from "@/interface/common.ts";
import { Category } from "@/Entity/category.entity.ts";
import { CategoryGameList } from "@/interface/game.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";

// 获取游戏标签
export function getGameTags(): Promise<Result<Game[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/tags")
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 通过id获取游戏详情
export function getGameById(id: string): Promise<Result<Game>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/get-game?id=" + id)
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 获取热门游戏列表
export function getHotGameCommunityList(): Promise<Result<Game[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/hot-game-community")
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 获取游戏分类列表
export function getGameCategoryList(): Promise<Result<Category[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/game-category")
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 根据分类获取游戏社区列表
export function getGameCommunityByCategory(
    category: string,
): Promise<Result<Game[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/game-community-category?category=" + category)
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}
// 根据分类列表获取游戏列表
export function postGameCommunityByCategoryList(categoryList: string[]):Promise<Result<CategoryGameList[]>> {
    return new Promise((resolve, reject) => {
        axios
            .post("/game/game-community-category-list", categoryList)
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

// 获取游戏社区帖子列表
export function getGameCommunityPostContentList(gameId:string):Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/game-community-post-content?gameId="+gameId)
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}
// 获取游戏社区攻略列表
export function getGameCommunityGuideContentList(gameId:string):Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/game-community-guide-content?gameId="+gameId)
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}
// 获取游戏社区新闻资讯列表
export function getGameCommunityNewsContentList(gameId:string):Promise<Result<UserContent[]>> {
    return new Promise((resolve, reject) => {
        axios
            .get("/game/game-community-news-content?gameId="+gameId)
            .then((res) => {
                console.log(res.data);
                return resolve(res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return reject(err.response.data);
            });
    });
}

