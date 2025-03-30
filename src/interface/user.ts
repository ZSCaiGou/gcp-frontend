import { UserProfile } from "@/Entity/user_profile.entity.ts";
import { UserLevel } from "@/Entity/user_level.entity.ts";
import {
    ContentStatus,
    UserContentType,
} from "@/Entity/user_content.entity.ts";

export type LoginType = "phone" | "username" | "email";

export interface LoginUserDto {
    account: string;
    password: string;
    type: LoginType;
}

export interface UserStoreState {
    id: string;
    username: string;
    phone: string;
    email: string;
    profile: UserProfile;
    level: UserLevel;
    roles: string[];
}

export interface Bio {
    // 性别
    sex: string;
    // 生日
    birthday: {
        year: number;
        month: number;
        day: number;
    };
    //地址
    address: {
        contry: string;
        city: string;
        district: string;
    };
    // 个性签名
    signature: string;
}

export interface UserDynamic {
    title: string;

    content: string;

    cover_url: string[];
}

