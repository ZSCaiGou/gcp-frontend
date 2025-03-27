

/**
 * FeedbackStatus
 * @enum
 * @property PENDING - 待处理
 * @property RESOLVED - 已处理
 * @property CLOSED - 已关闭
 */
export enum FeedbackStatus {
    PENDING = 'pending',
    RESOLVED ='resolved',
    CLOSED = 'closed',
}


export class Feedback {

    id: bigint;


    user_id:string;

    content: string;

    status: FeedbackStatus;

    created_at: Date;
}