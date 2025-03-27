import { Permission } from "./permission.entity";

export class Role {
    id: number;

    role_name: string;

    permissions: Permission[];
}
