import { useState, useEffect } from "react";
import {
    Table,
    Tag,
    Input,
    Button,
    Space,
    Select,
    message,
    Dropdown,
    Form,
    Modal,
    Card,
    Descriptions,
    Divider,
    Image,
    Flex,
} from "antd";
import { SwapOutlined, FilterOutlined, MoreOutlined } from "@ant-design/icons";
import { moderatorApi } from "@/api/moderator.api";
import { ModeratorCommunity } from "@/api/moderator.api";
import type { TablePaginationConfig, TableProps } from "antd";
import { FilterValue, SorterResult, SortOrder } from "antd/es/table/interface";

const { Option } = Select;
const { Search } = Input;

interface Props {
    managedCommunities: ModeratorCommunity[];
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: SortOrder;
    filters?: Record<string, FilterValue | null>;
}

const ContentReview = ({ managedCommunities }: Props) => {
    const [selectedCommunity, setSelectedCommunity] = useState<string>();
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sortField: "create_time",
        sortOrder: "descend",
    });
    const [searchForm] = Form.useForm();
    const [contentDetail, setContentDetail] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);

    const handleViewDetail = (record: any) => {
        setContentDetail(record);
        setDetailVisible(true);
    };

    useEffect(() => {
        if (selectedCommunity) {
            fetchContents();
        }
    }, [JSON.stringify(tableParams), selectedCommunity]);

    useEffect(() => {
        if (managedCommunities?.length > 0) {
            setSelectedCommunity(managedCommunities[0].id);
        } else {
            setSelectedCommunity(undefined);
            setContents([]);
        }
    }, [managedCommunities]);
    const fetchContents = async () => {
        try {
            setLoading(true);
            const searchValues = await searchForm.validateFields();
            if (!selectedCommunity) {
                message.error("请选择社区");
                return;
            }
            const data = await moderatorApi.getCommunityContents(
                selectedCommunity,
                {
                    page: tableParams.pagination?.current,
                    pageSize: tableParams.pagination?.pageSize,
                    search: searchValues.keyword,
                    status: tableParams.filters?.status as unknown as string[],
                    type: tableParams.filters?.type as unknown as string[],
                    sortField: tableParams.sortField,
                    sortOrder: tableParams.sortOrder,
                },
            );
            setContents(data.items);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.total,
                },
            });
        } catch (error) {
            message.error("获取审核内容失败");
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange: TableProps<any>["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        setTableParams({
            pagination,
            filters,
            sortField: (sorter as SorterResult<any>).field as string,
            sortOrder: (sorter as SorterResult<any>).order,
        });
    };

    const handleContentAction = async (id: string, action: string) => {
        try {
            await moderatorApi.reviewContent(
                id,
                action as "approve" | "reject",
            );
            message.success(`内容已${action === "approve" ? "通过" : "拒绝"}`);
            fetchContents(); // 刷新列表
        } catch (error) {
            message.error(error instanceof Error ? error.message : "操作失败");
        }
    };
    const contentColumns: TableProps["columns"] = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            render: (text: string, record: any) => (
                <a onClick={() => handleViewDetail(record)}>{text}</a>
            ),
            sorter: true,
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
            filters: [
                { text: "帖子", value: "post" },
                { text: "攻略", value: "guide" },
                { text: "资讯", value: "news" },
            ],
            filteredValue: tableParams.filters?.type,
        },
        {
            title: "状态",
            dataIndex: "status",
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
            filters: [
                { text: "待审核", value: "pending" },
                { text: "已通过", value: "approved" },
                { text: "已拒绝", value: "rejected" },
            ],
            filteredValue: tableParams.filters?.status,
        },
        {
            title: "创建时间",
            dataIndex: "create_time",
            key: "create_time",
            render: (text: string) => (
                <span>{text ? new Date(text).toLocaleString() : "未记录"}</span>
            ),
            sorter: true,
        },
        {
            title: "AI 审核结果",
            dataIndex: "check_result",
            key: "check_result",
            render: (text: string) => (
                <Tag color={text ? "red" : "green"}>{text ? text : "通过"}</Tag>
            ),
        },
        {
            title: "操作",
            key: "action",
            render: (record: any) =>
                record.status === "pending" || record.status === "rejected" ? (
                    <Space size="middle">
                        <Button
                            size="small"
                            type="primary"
                            onClick={() =>
                                handleContentAction(record.id, "approve")
                            }
                        >
                            通过
                        </Button>
                        <Button
                            size="small"
                            danger
                            onClick={() =>
                                handleContentAction(record.id, "reject")
                            }
                        >
                            拒绝
                        </Button>
                    </Space>
                ) : null,
        },
    ];
    return (
        <div>
            <div className="mb-4 flex justify-between">
                {managedCommunities?.length > 0 ? (
                    <Select
                        value={selectedCommunity}
                        onChange={setSelectedCommunity}
                        style={{ width: 180 }}
                        suffixIcon={<SwapOutlined />}
                    >
                        {managedCommunities.map((community) => (
                            <Option
                                label={community.name}
                                key={community.id}
                                value={community.id}
                            >
                                {community.name}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <div>暂无管理的社区</div>
                )}

                <Space>
                    <Form
                        form={searchForm}
                        layout="inline"
                        onFinish={fetchContents}
                    >
                        <Form.Item name="keyword">
                            <Search
                                placeholder="搜索内容"
                                allowClear
                                disabled={!selectedCommunity}
                            />
                        </Form.Item>
                    </Form>
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={fetchContents}
                    >
                        刷新
                    </Button>
                </Space>
            </div>
            <Table
                columns={contentColumns}
                dataSource={contents}
                rowKey="id"
                loading={loading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />

            <Modal
                title="内容详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={800}
            >
                {contentDetail && (
                    <Card>
                        <Card.Meta
                            title={contentDetail.title}
                            description={
                                <Space direction="vertical">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: contentDetail.content,
                                        }}
                                        style={{
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                            padding: "8px",
                                            border: "1px solid #f0f0f0",
                                            borderRadius: "4px",
                                            marginBottom: "16px",
                                        }}
                                    />
                                    {contentDetail.picture_urls?.length > 0 && (
                                        <div style={{ marginBottom: "16px" }}>
                                            <Divider orientation="left">
                                                图片内容
                                            </Divider>
                                            <Image.PreviewGroup>
                                                <Flex wrap="wrap" gap="8px">
                                                    {contentDetail.picture_urls.map(
                                                        (url: string) => (
                                                            <Image
                                                                key={url}
                                                                width={120}
                                                                height={120}
                                                                src={url}
                                                                style={{
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                            />
                                                        ),
                                                    )}
                                                </Flex>
                                            </Image.PreviewGroup>
                                        </div>
                                    )}
                                    <Descriptions column={2}>
                                        <Descriptions.Item label="作者">
                                            {contentDetail.author}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="类型">
                                            <Tag
                                                color={
                                                    contentDetail.type ===
                                                    "news"
                                                        ? "blue"
                                                        : "green"
                                                }
                                            >
                                                {contentDetail.type === "news"
                                                    ? "资讯"
                                                    : "帖子"}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="状态">
                                            <Tag
                                                color={
                                                    contentDetail.status ===
                                                    "pending"
                                                        ? "orange"
                                                        : contentDetail.status ===
                                                            "approved"
                                                          ? "green"
                                                          : "red"
                                                }
                                            >
                                                {contentDetail.status ===
                                                "pending"
                                                    ? "待审核"
                                                    : contentDetail.status ===
                                                        "approved"
                                                      ? "已通过"
                                                      : "已拒绝"}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="创建时间">
                                            {new Date(
                                                contentDetail.create_time,
                                            ).toLocaleString()}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Space>
                            }
                        />
                    </Card>
                )}
            </Modal>
        </div>
    );
};

export default ContentReview;
