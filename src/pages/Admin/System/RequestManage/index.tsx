import { Table, Tag, Button, Space, message, Input, Form, Flex } from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import {
    communityApi,
    ModeratorRequest,
    ModeratorRequestQueryParams,
} from "@/api/community";
import { useState, useEffect } from "react";
import type { TableProps } from "antd";
import { FilterValue, SorterResult, SortOrder } from "antd/es/table/interface";
import { TablePaginationConfig } from "antd/es/table";

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: SortOrder;
    filters?: Record<string, FilterValue | null>;
}

const RequestManage = () => {
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sortField: "username",
        sortOrder: null,
    });

    const [requests, setRequests] = useState<ModeratorRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchForm] = Form.useForm();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = {
                page: tableParams.pagination?.current,
                pageSize: tableParams.pagination?.pageSize,
                search: searchForm.getFieldValue("keyword"),
                status: tableParams.filters
                    ?.status as ModeratorRequestQueryParams["status"],
                sortField: tableParams.sortField,
                sortOrder: tableParams.sortOrder as "ascend" | "descend",
            };

            const data = await communityApi.getModeratorRequests(params);
            setRequests(data.items);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.total,
                },
            });
        } catch (error) {
            console.error("获取数据失败", error);
            message.error("获取版主申请列表失败");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [JSON.stringify(tableParams)]);

    const handleModeratorRequest = async (
        id: string,
        action: "approved" | "rejected",
    ) => {
        try {
            await communityApi.handleModeratorRequest(id, action);
            message.success(`已${action === "approved" ? "通过" : "拒绝"}申请`);
            fetchRequests();
        } catch (error) {
            message.error("处理申请失败");
            console.error(error);
        }
    };

    const handleTableChange: TableProps<ModeratorRequest>["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        setTableParams({
            pagination,
            filters,
            sortField: (sorter as SorterResult<ModeratorRequest>)
                .field as string,
            sortOrder: (sorter as SorterResult<ModeratorRequest>).order,
        });
    };

    const requestColumns: TableProps<ModeratorRequest>["columns"] = [
        {
            title: "申请人",
            dataIndex: "username",
            key: "username",
            sorter: true,
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
            filters: [
                { text: "待审核", value: "pending" },
                { text: "已通过", value: "approved" },
                { text: "已拒绝", value: "rejected" },
            ],
            filteredValue: tableParams.filters?.status || [],
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

    return (
        <div>
            <Flex className="!mb-4" justify="space-between" align="center">
                <Form
                    form={searchForm}
                    layout="inline"
                    onFinish={fetchRequests}
                >
                    <Form.Item name="keyword">
                        <Input placeholder="搜索申请人" allowClear />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            htmlType="submit"
                        >
                            搜索
                        </Button>
                    </Form.Item>
                </Form>
                <Button icon={<SyncOutlined />} type="default" onClick={fetchRequests}>
                    刷新
                </Button>
            </Flex>
            <Table
                columns={requestColumns}
                dataSource={requests}
                rowKey="id"
                loading={loading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default RequestManage;
