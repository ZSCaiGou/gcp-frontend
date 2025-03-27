

export enum NotificationType {
    SYSTEM = 'system',
    MESSAGE = 'message',
    EVENT = 'event',
}


export class Notification {

    id: bigint;
    

    user_id: number;


    tyep: NotificationType;


    content: string;


    is_read: boolean;



    created_at: Date;
}
