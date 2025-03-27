
export enum TargetType {
    TOPIC = 'topic',
    COMMENT = 'comment',
    CONTENT = 'content',
    GAME = 'game',
}
/**
 *  互动类型
 *  @enum {string} InteractionType
 *  @property {string} LIKE - 点赞
 *  @property {string} DISLIKE - 踩
 *  @property {string} SHARE - 分享
 *  @property {string} COLLECT - 收藏
 *  @property {string} FOLLOW - 关注
 */
export enum InteractionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
    SHARE = 'share',
    COLLECT = 'collect',
    FOLLOW = 'follow',
}


export class Interaction {

    id: bigint;


    user_id: number;


    target_type: TargetType;

    target_id: bigint;

    type: string;

    created_at: Date;
}
