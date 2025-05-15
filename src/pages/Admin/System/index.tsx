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
    Col,
    Row,
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
import RequestManage from "./RequestManage";
import { useEffect } from "react";
import SystemDataAnalytics from "./SystemDataAnalystics";
import { useNavigate } from "react-router";
const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const SystemAdmin = () => {
    const [activeTab, setActiveTab] = useState("users");
    const navigate = useNavigate();

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
            children: <RequestManage />,
        },
        {
            key: "analytics",
            label: (
                <span>
                    <PieChartOutlined />
                    数据分析
                </span>
            ),
            children: <SystemDataAnalytics/>,
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
                    <Button onClick={()=>{
                        navigate("/", { replace: true });
                    }} type="text">退出</Button>
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
