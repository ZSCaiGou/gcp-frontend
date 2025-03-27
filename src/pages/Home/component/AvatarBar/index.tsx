import { Avatar, Button, Flex, Menu, Popover, Tag } from "antd";
import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";

export function AvatarBar() {
    const navigate = useNavigate();
    // useUserStore
    const isLogin = useUserStore((state) => state.isLogin);
    const initUserInfo = useUserStore((state) => state.initUser);
    const userInfo = useUserStore((state) => state.user);
    // state
    const [popoverVisible, setPopoverVisible] = useState(false);

    // 元素
    const popContent = (
        <>
            <Flex vertical>
                <Button
                    type={"text"}
                    color={"default"}
                    onClick={() => {
                        navigate("home-personal");
                        setPopoverVisible(false);
                    }}
                >
                    个人中心
                </Button>
                <Button
                    type={"text"}
                    color={"default"}
                    onClick={() => {
                        useUserStore.getState().logout();
                        setPopoverVisible(false);
                        navigate("/", { replace: true })
                    }}
                >
                    退出登录
                </Button>
            </Flex>
        </>
    );

    // 函数

    const onOpenChange = (visible: boolean) => {
        setPopoverVisible(visible);
    };

    // 初始化
    useEffect(() => {
        // 初次渲染时，判断是否登录
        initUserInfo().then((res) => {});
        return () => {};
    }, []);

    return (
        <>
            {isLogin ? (
                <Popover
                    placement={"bottom"}
                    open={popoverVisible}
                    trigger={"click"}
                    content={popContent}
                    onOpenChange={onOpenChange}
                    arrow={false}
                >
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
                            className={"ml-2 text-[14px] font-bold text-black"}
                        >
                            {userInfo.profile.nickname
                                ? userInfo.profile.nickname
                                : userInfo.username}
                            <Tag color={"gold-inverse"} bordered={false} style={{fontSize:10,marginLeft:5}}>LV.{userInfo.level.level}</Tag>
                        </div>
                    </Flex>
                </Popover>
            ) : (
                <Button onClick={() => navigate("/login")}>登录</Button>
            )}
        </>
    );
}
