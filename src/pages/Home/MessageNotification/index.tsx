import {
    Flex,
    List,
    Badge,
    Avatar,
    Divider,
    Card,
    Layout,
    Typography,
    Tabs,
    message,
} from "antd";
import { MailOutlined, NotificationOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getAllMessages, Message, readMessage } from "@/api/message.api.ts";

const { Content } = Layout;
const { Title } = Typography;

export default function MessageNotification() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1"); // 默认选中第一个标签页

    useEffect(() => {
        getAllMessages().then((res) => {
            const data = res.data;
            setInteractionMessages(
                data.filter((data) => data.type === "event"),
            );
            setSystemMessages(data.filter((data) => data.type === "system"));
        });
    }, []);
    // 模拟消息数据
    const [interactionMessages, setInteractionMessages] = useState<Message[]>(
        [],
    );

    const [systemMessages, setSystemMessages] = useState<Message[]>([]);

    const markAsRead = (type: "event" | "system", id: string) => {
        if (type === "event") {
            readMessage(id)
                .then(() => {
                    setInteractionMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === id ? { ...msg, is_read: true } : msg,
                        ),
                    );
                })
                .catch((err) => {
                    message.error("互动消息已读失败，请稍后再试");
                });
        } else {
            readMessage(id)
                .then(() => {
                    setSystemMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === id ? { ...msg, is_read: true } : msg,
                        ),
                    );
                })
                .catch((err) => {
                    message.error("系统通知已读失败，请稍后再试");
                });
        }
    };

    const items = [
        {
            key: "1",
            label: (
                <span>
                    <MailOutlined />
                    互动消息
                    {interactionMessages.filter((m) => !m.is_read).length >=
                        0 && (
                        <Badge
                            count={
                                interactionMessages.filter((m) => !m.is_read)
                                    .length
                            }
                        />
                    )}
                </span>
            ),
            children: (
                <List

                    dataSource={interactionMessages}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                cursor: "pointer",
                                padding: "12px 16px",
                                transition: "all 0.3s",
                            }}
                            onClick={() => markAsRead("event", item.id)}
                            onMouseEnter={() => markAsRead("event", item.id)}
                        >
                            <List.Item.Meta
                                title={
                                    <>
                                        {!item.is_read && (
                                            <Badge
                                                dot
                                                color="red"
                                                style={{ marginRight: 8 }}
                                            />
                                        )}
                                        {item.content}
                                    </>
                                }
                                description={new Date(
                                    item.created_at,
                                ).toLocaleString()}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
        {
            key: "2",
            label: (
                <span>
                    <NotificationOutlined />
                    系统通知
                    {systemMessages.filter((m) => !m.is_read).length >= 0 && (
                        <Badge
                            count={
                                systemMessages.filter((m) => !m.is_read).length
                            }
                        />
                    )}
                </span>
            ),
            children: (
                <List

                    dataSource={systemMessages}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                cursor: "pointer",
                                padding: "12px 16px",
                                transition: "all 0.3s",
                            }}
                            onClick={() => markAsRead("system", item.id)}
                            onMouseEnter={() => markAsRead("system", item.id)}
                        >
                            <List.Item.Meta
                                title={
                                    <>
                                        {!item.is_read && (
                                            <Badge
                                                dot
                                                color="red"
                                                style={{ marginRight: 8 }}
                                            />
                                        )}
                                        {item.content}
                                    </>
                                }
                                description={new Date(
                                    item.created_at,
                                ).toLocaleString()}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
    ];

    return (
        <Layout className={"!min-h-60"}>
            <Content >
                <Card style={{ height: "100%" }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                    />
                </Card>
            </Content>
        </Layout>
    );
}
