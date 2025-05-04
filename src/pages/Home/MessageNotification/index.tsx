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
} from "antd";
import { MailOutlined, NotificationOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useState } from "react";

const { Content } = Layout;
const { Title } = Typography;

export default function MessageNotification() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("1"); // 默认选中第一个标签页

    // 模拟消息数据
    const [interactionMessages, setInteractionMessages] = useState([
        { id: 1, content: "用户A点赞了您的帖子", time: "10:30", read: false },
        { id: 2, content: "用户B评论了您的动态", time: "09:15", read: false },
        { id: 3, content: "用户C关注了您", time: "昨天", read: true },
    ]);

    const [systemMessages, setSystemMessages] = useState([
        { id: 1, content: "系统升级通知", time: "今天", read: false },
        { id: 2, content: "新功能上线", time: "昨天", read: true },
    ]);

    const markAsRead = (type: 'interaction' | 'system', id: number) => {
        if (type === 'interaction') {
            setInteractionMessages(prev => 
                prev.map(msg => 
                    msg.id === id ? {...msg, read: true} : msg
                )
            );
        } else {
            setSystemMessages(prev => 
                prev.map(msg => 
                    msg.id === id ? {...msg, read: true} : msg
                )
            );
        }
    };

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <MailOutlined />
                    互动消息
                    {interactionMessages.filter((m) => !m.read).length >= 0 && (
                        <Badge count={interactionMessages.filter((m) => !m.read).length} />
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
                            onClick={() => markAsRead('interaction', item.id)}
                            onMouseEnter={() => markAsRead('interaction', item.id)}
                        >
                            <List.Item.Meta
                                title={<>
                                    {!item.read && <Badge dot color="red" style={{marginRight: 8}} />}
                                    {item.content}
                                </>}
                                description={item.time}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    <NotificationOutlined />
                    系统通知
                    {systemMessages.filter((m) => !m.read).length >= 0 && (
                        <Badge count={systemMessages.filter((m) => !m.read).length} />
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
                            onClick={() => markAsRead('system', item.id)}
                            onMouseEnter={() => markAsRead('system', item.id)}
                        >
                            <List.Item.Meta
                                title={<>
                                    {!item.read && <Badge dot color="red" style={{marginRight: 8}} />}
                                    {item.content}
                                </>}
                                description={item.time}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
    ];

    return (
        <Layout style={{ height: "100vh" }}>
            <Content>
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
