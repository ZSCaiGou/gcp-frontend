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

    user_id: string;

    game_id: number;

    type: UserContentType;

    title: string;

    content: string;

    cover_url: string[];

    status: ContentStatus;

    create_time: Date;

    update_time: Date;
}
