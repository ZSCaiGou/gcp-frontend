import {
    Layout,
    Menu,
    Card,
    Tabs,
    Table,
    Tag,
    Input,
    Button,
    Space,
    Badge,
    Select,
    Modal,
    Form,
    message,
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    AuditOutlined,
    PieChartOutlined,
    PlusOutlined,
    TeamOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useState } from "react";
import UserManage from "@/pages/Admin/System/UserManage";
import CommunityManage from "@/pages/Admin/System/CommunityManage";

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const SystemAdmin = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState("");
    const [form] = Form.useForm();

    const moderatorRequests = [
        {
            id: "1",
            username: "user1",
            community: "英雄联盟社区",
            status: "pending",
        },
        {
            id: "2",
            username: "user2",
            community: "王者荣耀社区",
            status: "pending",
        },
        {
            id: "3",
            username: "user3",
            community: "原神社区",
            status: "approved",
        },
    ];

    const requestColumns = [
        {
            title: "申请人",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "申请社区",
            dataIndex: "community",
            key: "community",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag
                    color={
                        status === "pending"
                            ? "orange"
                            : status === "approved"
                              ? "green"
                              : "red"
                    }
                >
                    {status === "pending"
                        ? "待审核"
                        : status === "approved"
                          ? "已通过"
                          : "已拒绝"}
                </Tag>
            ),
        },
        {
            title: "操作",
            key: "action",
            render: (record: any) =>
                record.status === "pending" ? (
                    <Space size="middle">
                        <Button
                            type="text"
                            icon={<CheckOutlined />}
                            onClick={() =>
                                handleModeratorRequest(record.id, "approved")
                            }
                        />
                        <Button
                            type="text"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() =>
                                handleModeratorRequest(record.id, "rejected")
                            }
                        />
                    </Space>
                ) : null,
        },
    ];

    const handleCreateCommunity = () => {
        form.validateFields().then((values) => {
            console.log("创建社区:", values);
            setIsModalVisible(false);
            form.resetFields();
            message.success("社区创建成功");
        });
    };

    const handleModeratorRequest = (id: string, action: string) => {
        console.log(`处理版主申请 ${id}: ${action}`);
        message.success(`已${action === "approved" ? "通过" : "拒绝"}申请`);
    };

    const items: TabsProps["items"] = [
        {
            key: "users",
            label: (
                <span>
                    <UserOutlined />
                    用户管理
                </span>
            ),
            children: <UserManage />,
        },

        {
            key: "communities",
            label: (
                <span>
                    <TeamOutlined />
                    社区管理
                </span>
            ),
            children: <CommunityManage />,
        },
        {
            key: "requests",
            label: (
                <span>
                    <CheckOutlined />
                    版主申请
                </span>
            ),
            children: (
                <div>
                    <Table
                        columns={requestColumns}
                        dataSource={moderatorRequests}
                        rowKey="id"
                    />
                </div>
            ),
        },
        {
            key: "analytics",
            label: (
                <span>
                    <PieChartOutlined />
                    数据分析
                </span>
            ),
            children: <div>系统数据分析内容</div>,
        },
        {
            key: "logs",
            label: (
                <span>
                    <AuditOutlined />
                    系统日志
                </span>
            ),
            children: <div>系统日志内容</div>,
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Header className="flex items-center justify-between !bg-white px-6 shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                    系统管理后台
                </div>
                <Space>
                    <Badge count={5}>
                        <Button icon={<AuditOutlined />}>系统通知</Button>
                    </Badge>
                    <Button type="text">退出</Button>
                </Space>
            </Header>
            <Content className="m-4">
                <Card>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                        tabBarExtraContent={
                            <Button type="link" danger>
                                系统设置
                            </Button>
                        }
                    />
                </Card>
            </Content>


        </Layout>
    );
};

export default SystemAdmin;
