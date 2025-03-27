/**
 * TaskStatus
 * @enum
 * @property ACTIVE - 活动进行中
 * @property INACTIVE - 活动未开始
 * @property COMPLETED - 活动已结束
 */
export enum TaskStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    COMPLETED = "completed",
}

export class TaskReward {
    id: bigint;

    title: string;

    content: string;

    reward_points: number;

    status: TaskStatus;
}
