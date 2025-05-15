import { Avatar, Button, Dropdown, Flex, MenuProps, Tag, Badge } from "antd";
import { useEffect } from "react";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";

export function AvatarBar() {
    const navigate = useNavigate();
    const isLogin = useUserStore((state) => state.isLogin);
    const initUserInfo = useUserStore((state) => state.initUser);
    const userInfo = useUserStore((state) => state.user);

    const items: MenuProps["items"] = [
        {
            key: "personal",
            label: "个人中心",
            onClick: () => navigate("home-personal"),
        },
        {
            key: "security",
            label: "安全中心",
            onClick: () => navigate("home-security"),
        },
        {
            key: "logout",
            label: "退出登录",
            onClick: () => {
                useUserStore.getState().logout();
                navigate("/", { replace: true });
            },
        },
    ];

    useEffect(() => {
        initUserInfo().then((res) => {});
        return () => {};
    }, []);

    return (
        <>
            {isLogin ? (
                <Flex align="center" gap={16}>
                    <Badge count={5} size="small">
                        <MailOutlined
                            style={{ fontSize: 20, cursor: "pointer" }}
                            onClick={() => navigate("home-message")}
                        />
                    </Badge>

                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Flex
                            className={"cursor-pointer"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Avatar
                                size={32}
                                src={userInfo.profile.avatar_url}
                                icon={<UserOutlined />}
                            ></Avatar>
                            <div
                                className={
                                    "ml-2 flex items-center justify-between text-[14px] font-bold"
                                }
                            >
                                <span className="w-fit">
                                    {userInfo.profile.nickname ||
                                        userInfo.username}
                                </span>
                                <Tag
                                    color={"gold-inverse"}
                                    bordered={false}
                                    style={{ fontSize: 10, marginLeft: 5 }}
                                >
                                    LV.{userInfo.level.level}
                                </Tag>
                            </div>
                        </Flex>
                    </Dropdown>
                    {userInfo.roles[0] !== "USER" && (
                        <Button type="primary" onClick={()=>{
                            if(userInfo.roles[0] === "MODERATOR"){
                                navigate("/admin/community")
                            }else{
                                navigate("/admin/system")
                            }
                        }}>
                            {userInfo.roles[0] === "MODERATOR"
                                ? "版主管理"
                                : "系统管理"}
                        </Button>
                    )}
                </Flex>
            ) : (
                <Button onClick={() => navigate("/login")}>登录</Button>
            )}
        </>
    );
}
