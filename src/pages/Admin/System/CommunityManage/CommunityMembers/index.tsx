import {
    Table,
    Input,
    Button,
    Space,
    Tag,
    message,
    Spin,
    Popconfirm,
    Modal,
    TablePaginationConfig,
    Form,
} from "antd";
import {
    UserOutlined,
    SearchOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { TableProps } from "antd";
import {
    AdminCommunity,
    communityApi,
    CommunityQueryParams,
} from "@/api/community.ts";
import { FilterValue, SorterResult, SortOrder } from "antd/es/table/interface";

interface Member {
    id: string;
    username: string;
    email: string;
    joinTime: string;
    status: "active" | "disabled";
}

interface Props {
    communityId: string;
    isAdmin?: boolean; // 是否是管理员模式
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: SortOrder;
    filters?: Record<string, FilterValue | null>;
}

const CommunityMembers = ({ communityId }: Props) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sortField: "created_at",
        sortOrder: "descend",
    });

    const [searchForm] = Form.useForm();

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const searchValues = await searchForm.validateFields();
            const params: CommunityQueryParams = {
                page: tableParams.pagination?.current,
                pageSize: tableParams.pagination?.pageSize,
                search: searchValues.keyword,
                categories: tableParams.filters?.category as string[],
                status: tableParams.filters?.status as (
                    | "active"
                    | "disabled"
                )[],
                sortField: tableParams.sortField,
                sortOrder: tableParams.sortOrder as "ascend" | "descend",
            };

            const data = await communityApi.getCommunityMembers(
                communityId,
                params,
            );

            setMembers(data.items);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.total,
                },
            });
        } catch (error) {
            message.error(" 获取成员列表失败");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange: TableProps<Member>["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        setTableParams({
            pagination,
            filters,
            sortField: (sorter as SorterResult<Member>).field as string,
            sortOrder: (sorter as SorterResult<Member>).order,
        });
    };

    const columns: TableProps<Member>["columns"] = [
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    <a>{text}</a>
                </Space>
            ),
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "加入时间",
            dataIndex: "join_time",
            key: "join_time",
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) =>
                new Date(a.joinTime).getTime() - new Date(b.joinTime).getTime(),
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : "red"}>
                    {status === "active" ? "正常" : "封禁"}
                </Tag>
            ),
            filters: [
                { text: "正常", value: "active" },
                { text: "封禁", value: "disabled" },
            ],
            onFilter: (value, record) => record.status === value,
        },
    ];

    return (
        <div className="community-members">
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Space>
                    <Form
                        form={searchForm}
                        layout="inline"
                        onFinish={fetchMembers}
                    >
                        <Form.Item name="keyword" label="关键词">
                            <Input placeholder="社区名称" allowClear />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SearchOutlined />}
                            >
                                搜索
                            </Button>
                            <Button
                                style={{ marginLeft: 8 }}
                                onClick={() => {
                                    searchForm.resetFields();
                                    setTableParams({
                                        pagination: {
                                            current: 1,
                                            pageSize: 10,
                                        },
                                        filters: {},
                                        sortField: "created_at",
                                        sortOrder: "descend",
                                    });
                                }}
                            >
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={members}
                rowKey="id"
                loading={loading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default CommunityMembers;
