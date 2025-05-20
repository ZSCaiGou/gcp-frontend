import {
    Avatar,
    Button,
    Dropdown,
    Flex,
    MenuProps,
    Tag,
    Badge,
    Modal,
    Form,
    Select,
    message,
} from "antd";
import { useEffect, useState } from "react";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";
import { getUnreadCount } from "@/api/message.api.ts";
import { searchGames } from "@/api/game.api.ts";
import { applyForModerator } from "@/api/moderator.api.ts";

export function AvatarBar() {
    const navigate = useNavigate();
    const isLogin = useUserStore((state) => state.isLogin);
    const initUserInfo = useUserStore((state) => state.initUser);
    const userInfo = useUserStore((state) => state.user);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<string>();
    const [games, setGames] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleApply = () => {
        if (!selectedGame) {
            message.error("请选择游戏社区");
            return;
        }
        setLoading(true);
        // 这里调用申请版主的API
        applyForModerator(selectedGame)
            .then(() => {
                message.success("申请已提交");
                setIsModalOpen(false);
            })
            .catch((err) => {
                message.error(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSearch = (value: string) => {
        // 这里调用搜索游戏的API
        searchGames(value).then((res) => {
            setGames(
                res.data.map((game) => ({
                    label: game.title,
                    value: game.id as unknown as string,
                })),
            );
        });
    };
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
    useEffect(() => {
        let interval = null;
        if (isLogin && userInfo) {
            interval = setInterval(() => {
                getUnreadCount().then((res) => {
                    setUnreadCount(res.data);
                });
            }, 5000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isLogin]);
    return (
        <>
            {isLogin ? (
                <Flex align="center" gap={16}>
                    <Badge count={unreadCount} size="small">
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
                        <Button
                            type="primary"
                            onClick={() => {
                                if (userInfo.roles[0] === "MODERATOR") {
                                    navigate("/admin/community");
                                } else {
                                    navigate("/admin/system");
                                }
                            }}
                        >
                            {userInfo.roles[0] === "MODERATOR"
                                ? "版主管理"
                                : "系统管理"}
                        </Button>
                    )}
                    {userInfo.roles[0] === "USER" && (
                        <Button
                            type="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            申请成为版主
                        </Button>
                    )}
                </Flex>
            ) : (
                <Button onClick={() => navigate("/login")}>登录</Button>
            )}

            <Modal
                title="申请成为版主"
                open={isModalOpen}
                onOk={handleApply}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={loading}
            >
                <Form layout="vertical">
                    <Form.Item label="选择游戏社区" required>
                        <Select
                            showSearch
                            placeholder="搜索游戏社区"
                            optionFilterProp="label"
                            onSearch={handleSearch}
                            onChange={setSelectedGame}
                            filterOption={false}
                            options={games}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
