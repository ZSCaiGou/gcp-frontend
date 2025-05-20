import { Game } from "@/Entity/game.entity.ts";
import { Topic } from "@/Entity/topic.entity.ts";

/**
 * 用户内容类型枚举
 * @enum {string}
 * @property {string} GUIDE 攻略
 * @property {string} RESOURCE 资源
 * @property {string} NEWS 新闻资讯
 * @property {string} POST 帖子
 *
 */
export enum UserContentType {
    GUIDE = "guide",
    RESOURCE = "resource",
    NEWS = "news",
    POST = "post",
}
export type UserContentComment = {

    id: string,
    content: string,
    likeCount: number,
    reply_count:number,
    create_at: string,
    created_at?: string,
    isLiked: boolean,
    user_info: {
        id: string,
        nickname: string,
        avatar_url: string,
        level: number,
    },    
    replies?: UserContentComment[];
    showReplies?: boolean;
    loadingReplies?: boolean;
    origin_id: string;
    parent_id: string;
};
/**
 * 评论状态枚举
 * @enum {string}
 * @property {string} PENDING 待审核
 * @property {string} APPROVED 审核通过
 * @property {string} REJECTED 审核拒绝
 * @property {string} HIDDEN 隐藏
 * @property {string} DELETED 已删除
 */
export enum ContentStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    HIDDEN = "hidden",
    DELETED = "deleted",
}

export class UserContent {
    id: bigint;


    game_id: number;

    type: UserContentType;

    title: string;

    content: string;

    cover_url: string;

    picture_urls: string[];

    status: ContentStatus;

    create_time: Date;

    update_time: Date;

    game_tags?: Game[];
    topic_tags?: Topic[];
    isLiked: boolean;
    like_count: number;
    comment_count: number;
    collect_count: number;
    isFavorited: boolean;
    user_info?: {
        id: string;
        nickname: string;
        avatar_url: string;
        level: number;
        is_focused: boolean;
    };
    comments : UserContentComment[];
}
