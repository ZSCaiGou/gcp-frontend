import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { UserProfile } from "./user_profile.entity";
import { UserLevel } from "./user_level.entity";

export enum UserStatus {
    ACTIVE = "active",
    DISABLED = "disabled",
    DELETED = "deleted",
}

export class User {
    id: string;

    username: string;

    email: string;

    phone: string;

    password: string;

    create_time: Date;

    update_time: Date;

    last_login_time: Date;

    status: UserStatus;

    // 用户角色

    roles: Role[];

    // 用户权限

    permissions: Permission[];

    // 用户资料

    profile: UserProfile;

    // 用户等级

    level: UserLevel;
}
