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
    Dropdown,
    message,
} from "antd";
import {
    MessageOutlined,
    FlagOutlined,
    BarChartOutlined,
    SwapOutlined,
    FilterOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useEffect, useState } from "react";
import ContentReview from "./ContentReview";
import ReportManage from "./ReportManage";
import { moderatorApi, ModeratorCommunity } from "@/api/moderator.api";
import Analytics from "./Analytics";
import { useNavigate } from "react-router";

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const CommunityAdmin = () => {
    const [activeTab, setActiveTab] = useState("content");
    const navigate = useNavigate();

    // 社区管理员管理的社区列表
    const [managedCommunities, setManagedCommunities] =
        useState<ModeratorCommunity[]>(); // 这里需要从后端获取实际的社区列表，这里只是示例数据
    useEffect(() => {
        // 这里需要从后端获取实际的社区列表，这里只是示例数据
        moderatorApi.modGetManagedCommunities().then((res) => {
            setManagedCommunities(res);
        });
    }, []);
    const items: TabsProps["items"] = [
        {
            key: "content",
            label: (
                <span>
                    <MessageOutlined />
                    内容审核
                </span>
            ),
            children: <ContentReview managedCommunities={managedCommunities} />,
        },
        {
            key: "reports",
            label: (
                <span>
                    <FlagOutlined />
                    举报管理
                </span>
            ),
            children: <ReportManage managedCommunities={managedCommunities} />,
        },
        {
            key: "analytics",
            label: (
                <span>
                    <BarChartOutlined />
                    社区数据
                </span>
            ),
            children: <Analytics managedCommunities={managedCommunities} />,
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Header className="flex items-center justify-between !bg-white px-6 shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                    社区管理后台
                </div>
                <Space>
                    <Badge count={3}>
                        <Button icon={<FlagOutlined />}>待处理举报</Button>
                    </Badge>
                    <Button
                        type="text"
                        onClick={() => {
                            navigate("/", { replace: true });
                        }}
                    >
                        退出
                    </Button>
                </Space>
            </Header>
            <Content className="m-4">
                <Card>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default CommunityAdmin;
