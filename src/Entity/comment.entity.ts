
export enum CommentType {
    USERCONTENT = 'usercontent',
    TOPIC = 'topic',
}

export enum CommentStatus {
    NORMAL = 'normal',
    DELETED = 'deleted',
    HIDDEN = 'hidden',
}


export class Comment {

    id: bigint;


    content: string;


    user_id: string;


    parent_id: number;


    status: CommentStatus;


    type: CommentType;


    createdAt: Date;


    updatedAt: Date;
}
