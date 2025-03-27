/**
 * 客服工单
 * @enum
 *
 */
export enum SupportTicketStatus {
    PENDING = "pending",
    RESOLVED = "resolved",
    CLOSED = "closed",
}

export class SupportTicket {
    id: bigint;

    user_id: string;

    question: string;

    response: string;

    status: SupportTicketStatus;

    created_at: Date;
}
