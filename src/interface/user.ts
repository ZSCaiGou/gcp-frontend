export type LoginType = "phone" | "username" | "email";
export  interface LoginUserDto{
  account:string;
  password:string;
  type:LoginType
}