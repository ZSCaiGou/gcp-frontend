/**
 * ResourceStatus enum
 * @enum
 * @property {string} PENDING - 审核中
 * @property {string} APPROVED - 审核通过
 * @property {string} REJECTED - 审核拒绝
 * @property {string} HIDDEN - 隐藏
 * @property {string} DELETED - 删除
 */
export enum ResourceStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    HIDDEN = "hidden",
    DELETED = "deleted",
}

/**
 * ResourceType enum
 * @enum
 * @property {string} IMAGE - 图片
 * @property {string} VIDEO - 视频
 * @property {string} DOCUMENT - 文档
 */
export enum ResourceType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document",
}

export class Resource {
    id: bigint;

    user_id: string;

    game_id: number;

    file_url: string;

    file_type: ResourceStatus;

    copyright: string;

    status: ResourceType;
}
