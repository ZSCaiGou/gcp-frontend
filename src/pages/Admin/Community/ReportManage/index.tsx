import { Table, Tag, Input, Button, Space, Badge, Select, message } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ModeratorCommunity } from "@/api/moderator.api";

const { Search } = Input;
const { Option } = Select;

interface Props {
    managedCommunities:ModeratorCommunity[];
}

const ReportManage = ({ managedCommunities }: Props) => {
    const [selectedCommunity, setSelectedCommunity] = useState(managedCommunities[0]?.id); // 默认选择第一个社区

    // 模拟数据 - 举报内容
    const [reports] = useState([
        {
            id: "1",
            content: "不当言论",
            reporter: "user4",
            type: "abuse",
            status: "pending",
            community: "英雄联盟社区",
        },
    ]);

    const handleReportAction = (id: string, action: string) => {
        console.log(`处理举报 ${id}: ${action}`);
        message.success(`举报已${action === "resolve" ? "处理" : "忽略"}`);
    };

    const reportColumns = [
        {
            title: "举报内容",
            dataIndex: "content",
            key: "content",
            render: (text: string, record: any) => (
                <a onClick={() => console.log("查看详情:", record.id)}>
                    {text}
                </a>
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
                <Tag
                    color={
                        type === "spam"
                            ? "red"
                            : type === "abuse"
                              ? "orange"
                              : "purple"
                    }
                >
                    {type === "spam"
                        ? "垃圾广告"
                        : type === "abuse"
                          ? "不当言论"
                          : "违规内容"}
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
            render: (record: any) =>
                record.status === "pending" ? (
                    <Space size="middle">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() =>
                                handleReportAction(record.id, "resolve")
                            }
                        >
                            处理
                        </Button>
                        <Button
                            size="small"
                            onClick={() =>
                                handleReportAction(record.id, "ignore")
                            }
                        >
                            忽略
                        </Button>
                    </Space>
                ) : (
                    <Button size="small">查看处理</Button>
                ),
        },
    ];

    return (
        <div>
            <div className="mb-4 flex justify-between">
                <Select
                    value={selectedCommunity}
                    onChange={(value) => setSelectedCommunity(value)}
                    style={{ width: 180 }}
                    suffixIcon={<SwapOutlined />}
                >
                    {managedCommunities?.map((community) => (
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
                    (item) =>
                        item.community ===
                        managedCommunities.find(
                            (c) => c.id === selectedCommunity,
                        )?.name,
                )}
                rowKey="id"
            />
        </div>
    );
};

export default ReportManage;
