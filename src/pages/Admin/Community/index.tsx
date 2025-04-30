import { Layout, Menu, Card, Tabs, Table, Tag, Input, Button, Space, Badge, Select, Dropdown, message } from "antd";
import {
    MessageOutlined,
    FlagOutlined,
    BarChartOutlined,
    SwapOutlined,
    FilterOutlined,
    MoreOutlined
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useState } from "react";

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const CommunityAdmin = () => {
    const [activeTab, setActiveTab] = useState("content");
    const [selectedCommunity, setSelectedCommunity] = useState("1");

    // 模拟数据 - 社区管理员管理的社区列表
    const managedCommunities = [
        { id: "1", name: "英雄联盟社区" },
        { id: "2", name: "王者荣耀社区" },
        { id: "3", name: "DOTA2社区" },
    ];

    // 模拟数据 - 待审核内容
    const pendingContents = [
        {
            id: "1",
            title: "新英雄攻略分享",
            author: "user1",
            type: "post",
            status: "pending",
            community: "英雄联盟社区"
        },
        {
            id: "2",
            title: "赛季更新讨论",
            author: "user2",
            type: "post",
            status: "pending",
            community: "王者荣耀社区"
        },
        {
            id: "3",
            title: "赛事资讯",
            author: "user3",
            type: "news",
            status: "pending",
            community: "DOTA2社区"
        },
    ];

    // 模拟数据 - 举报内容
    const reports = [
        {
            id: "1",
            content: "不当言论",
            reporter: "user4",
            type: "abuse",
            status: "pending",
            community: "英雄联盟社区"
        },
        {
            id: "2",
            content: "垃圾广告",
            reporter: "user5",
            type: "spam",
            status: "pending",
            community: "王者荣耀社区"
        },
        {
            id: "3",
            content: "违规内容",
            reporter: "user6",
            type: "violation",
            status: "resolved",
            community: "DOTA2社区"
        },
    ];

    const handleCommunityChange = (value: string) => {
        setSelectedCommunity(value);
        // 这里可以加载对应社区的数据
    };

    const handleContentAction = (id: string, action: string) => {
        console.log(`处理内容 ${id}: ${action}`);
        message.success(`内容已${action === "approve" ? "通过" : "拒绝"}`);
    };

    const handleReportAction = (id: string, action: string) => {
        console.log(`处理举报 ${id}: ${action}`);
        message.success(`举报已${action === "resolve" ? "处理" : "忽略"}`);
    };

    const contentColumns = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            render: (text: string, record: any) => (
                <a onClick={() => console.log("查看详情:", record.id)}>{text}</a>
            ),
        },
        {
            title: "作者",
            dataIndex: "author",
            key: "author",
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "news" ? "blue" : "green"}>
                    {type === "news" ? "资讯" : "帖子"}
                </Tag>
            ),
        },
        {
            title: "所属社区",
            dataIndex: "community",
            key: "community",
        },
        {
            title: "操作",
            key: "action",
            render: (record: any) => (
                <Space size="middle">
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => handleContentAction(record.id, "approve")}
                    >
                        通过
                    </Button>
                    <Button
                        size="small"
                        danger
                        onClick={() => handleContentAction(record.id, "reject")}
                    >
                        拒绝
                    </Button>
                    <Dropdown menu={{
                        items: [
                            { key: "view", label: "查看详情" },
                            { key: "edit", label: "编辑" },
                            { key: "delete", label: "删除" },
                        ]
                    }}>
                        <Button size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const reportColumns = [
        {
            title: "举报内容",
            dataIndex: "content",
            key: "content",
            render: (text: string, record: any) => (
                <a onClick={() => console.log("查看详情:", record.id)}>{text}</a>
            ),
        },
        {
            title: "举报人",
            dataIndex: "reporter",
            key: "reporter",
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "spam" ? "red" : type === "abuse" ? "orange" : "purple"}>
                    {type === "spam" ? "垃圾广告" : type === "abuse" ? "不当言论" : "违规内容"}
                </Tag>
            ),
        },
        {
            title: "所属社区",
            dataIndex: "community",
            key: "community",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Badge
                    status={status === "pending" ? "processing" : "success"}
                    text={status === "pending" ? "待处理" : "已处理"}
                />
            ),
        },
        {
            title: "操作",
            key: "action",
            render: (record: any) => (
                record.status === "pending" ? (
                    <Space size="middle">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => handleReportAction(record.id, "resolve")}
                        >
                            处理
                        </Button>
                        <Button
                            size="small"
                            onClick={() => handleReportAction(record.id, "ignore")}
                        >
                            忽略
                        </Button>
                    </Space>
                ) : (
                    <Button size="small">查看处理</Button>
                )
            ),
        },
    ];

    const items: TabsProps["items"] = [
        {
            key: "content",
            label: (
                <span>
          <MessageOutlined />
          内容审核
        </span>
            ),
            children: (
                <div>
                    <div className="flex justify-between mb-4">
                        <Space>
                            <Select
                                value={selectedCommunity}
                                onChange={handleCommunityChange}
                                style={{ width: 180 }}
                                suffixIcon={<SwapOutlined />}
                            >
                                {managedCommunities.map(community => (
                                    <Option key={community.id} value={community.id}>
                                        {community.name}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                defaultValue="all"
                                style={{ width: 120 }}
                                suffixIcon={<FilterOutlined />}
                            >
                                <Option value="all">全部类型</Option>
                                <Option value="post">帖子</Option>
                                <Option value="news">资讯</Option>
                            </Select>
                        </Space>
                        <Search placeholder="搜索内容" allowClear className="w-64" />
                    </div>
                    <Table
                        columns={contentColumns}
                        dataSource={pendingContents.filter(
                            item => selectedCommunity === "all" || item.community === managedCommunities.find(
                                c => c.id === selectedCommunity
                            )?.name
                        )}
                        rowKey="id"
                    />
                </div>
            ),
        },
        {
            key: "reports",
            label: (
                <span>
          <FlagOutlined />
          举报管理
        </span>
            ),
            children: (
                <div>
                    <div className="flex justify-between mb-4">
                        <Select
                            value={selectedCommunity}
                            onChange={handleCommunityChange}
                            style={{ width: 180 }}
                            suffixIcon={<SwapOutlined />}
                        >
                            {managedCommunities.map(community => (
                                <Option key={community.id} value={community.id}>
                                    {community.name}
                                </Option>
                            ))}
                        </Select>
                        <Search placeholder="搜索举报" allowClear className="w-64" />
                    </div>
                    <Table
                        columns={reportColumns}
                        dataSource={reports.filter(
                            item => selectedCommunity === "all" || item.community === managedCommunities.find(
                                c => c.id === selectedCommunity
                            )?.name
                        )}
                        rowKey="id"
                    />
                </div>
            ),
        },
        {
            key: "analytics",
            label: (
                <span>
          <BarChartOutlined />
          社区数据
        </span>
            ),
            children: (
                <div>
                    <div className="mb-4">
                        <Select
                            value={selectedCommunity}
                            onChange={handleCommunityChange}
                            style={{ width: 180 }}
                            suffixIcon={<SwapOutlined />}
                        >
                            {managedCommunities.map(community => (
                                <Option key={community.id} value={community.id}>
                                    {community.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card>
                            <h3 className="text-gray-500">今日发帖</h3>
                            <p className="text-2xl font-bold">124</p>
                        </Card>
                        <Card>
                            <h3 className="text-gray-500">今日活跃用户</h3>
                            <p className="text-2xl font-bold">356</p>
                        </Card>
                        <Card>
                            <h3 className="text-gray-500">待审核内容</h3>
                            <p className="text-2xl font-bold">23</p>
                        </Card>
                    </div>
                    <Card title="近7日活跃度">
                        {/* 这里可以放置图表 */}
                        <div className="h-64 bg-gray-100 flex items-center justify-center">
                            活跃度图表
                        </div>
                    </Card>
                </div>
            ),
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Header className="!bg-white flex justify-between items-center px-6 shadow-sm">
                <div className="text-xl font-bold text-blue-600">社区管理后台</div>
                <Space>
                    <Badge count={3}>
                        <Button icon={<FlagOutlined />}>待处理举报</Button>
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
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default CommunityAdmin;