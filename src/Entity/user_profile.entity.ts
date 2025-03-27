import { Bio } from "@/interface/user.ts";

export enum PrivacyLevel {
    PUBLIC = "public",
    PRIVATE = "private",
    friends = "friends",
}

export class UserProfile {
    id: number;

    avatar_url: string;

    nickname: string;

    bio: Bio;

    privacy_level: PrivacyLevel;
}
