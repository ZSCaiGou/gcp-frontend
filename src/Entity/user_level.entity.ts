import { Badge } from "./badge.entity";

export class UserLevel {
    id: bigint;

    points: number;

    level: number;

    ex: number;

    badges: Badge[];
}
