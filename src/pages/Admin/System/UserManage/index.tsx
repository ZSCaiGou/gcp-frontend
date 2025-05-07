// System/UserManage/index.tsx
import {
    Table,
    Tag,
    Input,
    Button,
    Space,
    Badge,
    Modal,
    Form,
    Select,
    message,
    Spin,
    Popconfirm,
    Dropdown,
    Divider,
    Transfer,
    Typography,
    MenuProps,
    TablePaginationConfig,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    SyncOutlined,
    MoreOutlined,
    MailOutlined,
    KeyOutlined,
    StopOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    AuditOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Community, User, userApi, UserQueryParams } from "@/api/user.api.ts";
import type { TableProps, TransferProps } from "antd";
import { FilterValue, SorterResult, SortOrder } from "antd/es/table/interface";
import useUserStore from "@/stores/useUserStore.tsx";

const { Text } = Typography;

// 定义筛选和排序状态类型
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: SortOrder;
    filters?: Record<string, FilterValue | null>;
}

const UserManage = () => {
    const adminStore = useUserStore();

    // 状态管理
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sortField: "username",
        sortOrder: null,
    });

    // 模拟社区数据
    const [allCommunities, setAllCommunities] = useState<Community[]>([]);
    // 用户数据
    const [users, setUsers] = useState<User[]>([]);
    // 编辑模态框
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 编辑用户信息
    const [editingUser, setEditingUser] = useState<User | null>(null);
    //搜索
    const [searchForm] = Form.useForm();
    // 加载状态
    const [loading, setLoading] = useState({
        users: false,
        communities: false,
        submitting: false,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<
        TransferProps["targetKeys"]
    >([]);
    const [communityTransferVisible, setCommunityTransferVisible] =
        useState(false);
    const [targetCommunities, setTargetCommunities] = useState<
        TransferProps["targetKeys"]
    >([]);
    const [form] = Form.useForm();
    // 初始化
    useEffect(() => {
        adminStore.initUser();
        loadInitialData();
    }, []);
    // 当编辑用户时初始化社区选择
    useEffect(() => {
        if (editingUser && editingUser.role === "MODERATOR") {
            setCommunityTransferVisible(true);

            setTargetCommunities(
                editingUser.managed_communities.map((c) => c.id) || [],
            );
        } else {
            setCommunityTransferVisible(false);
        }
    }, [editingUser]);
    // 当表格参数改变时重新加载用户数据
    useEffect(() => {
        if (loading.users) {
            fetchUsers();
        }
    }, [tableParams]);
    // 加载初始数据
    const loadInitialData = async () => {
        try {
            setLoading((prev) => ({ ...prev, users: true, communities: true }));

            // 并行请求用户和社区数据
            const [, communitiesData] = await Promise.all([
                fetchUsers(),
                userApi.getCommunities(),
            ]);

            setAllCommunities(communitiesData);
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({
                ...prev,
                users: false,
                communities: false,
            }));
        }
    };
    // 加载用户数据
    const fetchUsers = async () => {
        try {
            setLoading({ ...loading, users: true });

            // 从表单获取搜索条件
            const searchValues = await searchForm.validateFields();

            // 准备API参数
            const params: UserQueryParams = {
                page: tableParams.pagination?.current,
                pageSize: tableParams.pagination?.pageSize,
                search: searchValues.keyword,
                roles: tableParams.filters?.role as UserQueryParams["roles"],
                status: tableParams.filters
                    ?.status as UserQueryParams["status"],
                sortField: tableParams.sortField,
                sortOrder: tableParams.sortOrder as "ascend" | "descend",
            };

            const data = await userApi.getUsersWithPagination(params);

            setUsers(data.items);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.total,
                },
            });
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, users: false }));
        }
    };

    // 编辑
    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };
    // 改变用户状态
    const handleStatusChange = async (
        userId: string,
        status: "active" | "disabled",
    ) => {
        try {
            setLoading((prev) => ({ ...prev, submitting: true }));
            await userApi.batchUpdateUserStatus([userId], status);
            setUsers(
                users.map((user) =>
                    user.id === userId ? { ...user, status } : user,
                ),
            );
            message.success(`用户${status === "active" ? "激活" : "禁用"}成功`);
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };
    // 删除用户
    const handleDelete = async (userId: string) => {
        try {
            setLoading((prev) => ({ ...prev, submitting: true }));
            await userApi.deleteUser([userId]);
            setUsers((prev) => prev.filter((user) => user.id !== userId));
            message.success("用户删除成功");
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };
    // 批量删除用户
    const handleBatchDelete = async () => {
        try {
            setLoading((prev) => ({ ...prev, submitting: true }));
            await userApi.deleteUser(selectedRowKeys as string[]);
            setUsers(
                users.filter((user) => !selectedRowKeys.includes(user.id)),
            );
            setSelectedRowKeys([]);
            message.success(`已删除${selectedRowKeys.length}个用户`);
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };
    //批量激活/禁用用户
    const handleBatchStatusChange = async (status: "active" | "disabled") => {
        try {
            setLoading((prev) => ({ ...prev, submitting: true }));
            await userApi.batchUpdateUserStatus(
                selectedRowKeys as string[],
                status,
            );
            setUsers(
                users.map((user) =>
                    selectedRowKeys.includes(user.id)
                        ? { ...user, status }
                        : user,
                ),
            );
            setSelectedRowKeys([]);
            message.success(
                `已${status === "active" ? "激活" : "禁用"}${selectedRowKeys.length}个用户`,
            );
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };

    // 重置密码
    const handleResetPassword = async (userId: string) => {
        try {
            setLoading((prev) => ({ ...prev, submitting: true }));
            await userApi.resetPassword(userId);
            message.success("密码重置邮件已发送");
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };
    // 提交表单更改
    const handleSubmit = async () => {
        try {
            // 验证表单,并获取表单值
            const values = (await form.validateFields()) as User;

            if (editingUser) {
                // 更新用户信息
                try {
                    setLoading((prev) => ({ ...prev, submitting: true }));
                    const updatedUser = await userApi.updateUser(
                        editingUser.id,
                        {
                            ...values,
                            managed_communities: allCommunities.filter((c) =>
                                targetCommunities.includes(c.id),
                            ),
                        },
                    );
                    setUsers((prev) =>
                        prev.map((user) =>
                            user.id === updatedUser.id
                                ? { ...updatedUser, key: updatedUser.id }
                                : user,
                        ),
                    );
                    message.success("用户更新成功");
                    return true;
                } catch (err) {
                    message.error(err.message);
                    return false;
                } finally {
                    setLoading((prev) => ({ ...prev, submitting: false }));
                    setIsModalVisible(false);
                }
            } else {
                // 创建新用户
                try {
                    setLoading((prev) => ({ ...prev, submitting: true }));
                    const newUser = await userApi.createUser({
                        ...values,
                        managed_communities: allCommunities.filter((c) =>
                            targetCommunities.includes(c.id),
                        ),
                    });
                    setUsers((prev) => [
                        ...prev,
                        { ...newUser, key: newUser.id },
                    ]);
                    message.success("用户创建成功");

                    return true;
                } catch (err) {
                    message.error(err.message);
                    return false;
                } finally {
                    setLoading((prev) => ({ ...prev, submitting: false }));
                    setIsModalVisible(false);
                    form.resetFields();
                }
            }
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };
    // 关闭编辑模态框
    const handleCancel = () => {
        console.log(editingUser);
        setIsModalVisible(false);
        form.resetFields();
        setTargetCommunities(
            editingUser.managed_communities.map((c) => c.id) || [],
        );
        setEditingUser(null);
    };

    // 改变社区选择
    const handleCommunityTransferChange: TransferProps["onChange"] = (
        newTargetKeys,
    ) => {
        setTargetCommunities(newTargetKeys as string[]);
    };

    // 表格变化处理
    const handleTableChange: TableProps<User>["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        setLoading({ ...loading, users: true });
        setTableParams({
            pagination,
            filters,
            sortField: (sorter as SorterResult<User>).field as string,
            sortOrder: (sorter as SorterResult<User>).order,
        });
    };

    // 重置筛选
    const handleResetFilters = () => {
        setLoading({ ...loading, users: true });
        searchForm.resetFields();
        setTableParams({
            pagination: {
                current: 1,
                pageSize: 10,
            },
            filters: {},
            sortField: "username",
            sortOrder: null,
        });
    };
    // 社区选择器选项渲染
    const renderCommunityItem = (item: Community) => {
        return {
            label: (
                <div>
                    <Text strong>{item.title}</Text>
                    <div style={{ fontSize: 12, color: "#999" }}>
                        {item.description}
                    </div>
                </div>
            ),
            value: item.id,
        };
    };
    // 多选
    const onSelectChange = (
        newSelectedRowKeys: TransferProps["selectedKeys"],
    ) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    // 表格多选选项
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    // 更多操作菜单项
    const moreActionsItems = (record: User): MenuProps["items"] => [
        {
            key: "reset-password",
            label: "重置密码",
            icon: <KeyOutlined />,
            onClick: () => handleResetPassword(record.id),
            disabled: record.role === "ADMIN",
        },
        {
            key: "send-email",
            label: "发送邮件",
            icon: <MailOutlined />,
            onClick: () => message.info("发送邮件功能待实现"),
        },
        {
            key: "activity-log",
            label: "活动记录",
            icon: <AuditOutlined />,
            onClick: () => message.info("活动记录功能待实现"),
        },
    ];
    // 表格列
    const columns: TableProps<User>["columns"] = [
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            sorter: true,
            sortOrder:
                tableParams.sortField === "username"
                    ? tableParams.sortOrder
                    : null,
            render: (text, record) => (
                <div>
                    <span>{text}</span>
                    {record.role === "SUPER_ADMIN" && (
                        <Tag color="red" style={{ marginLeft: 8 }}>
                            超级管理员
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "角色",
            dataIndex: "role",
            key: "role",
            render: (role, record) => (
                <div>
                    <Tag
                        color={
                            role === "ADMIN" || role === "SUPER_ADMIN"
                                ? "red"
                                : role === "MODERATOR"
                                  ? "blue"
                                  : "green"
                        }
                    >
                        {role === "ADMIN" || role === "SUPER_ADMIN"
                            ? "管理员"
                            : role === "MODERATOR"
                              ? "版主"
                              : "普通用户"}
                    </Tag>
                    {role === "MODERATOR" && record.managed_communities && (
                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                管理社区:{" "}
                                {record.managed_communities
                                    .map((item) => item.title)
                                    .join(", ")}
                            </Text>
                        </div>
                    )}
                </div>
            ),
            filters: [
                { text: "管理员", value: "ADMIN" },
                { text: "版主", value: "MODERATOR" },
                { text: "普通用户", value: "USER" },
            ],
            filteredValue: tableParams.filters?.role || [],
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge
                    status={status === "active" ? "success" : "error"}
                    text={status === "active" ? "活跃" : "禁用"}
                />
            ),
            filters: [
                { text: "活跃", value: "active" },
                { text: "禁用", value: "disabled" },
            ],
            filteredValue: tableParams.filters?.status || null,
        },
        {
            title: "注册时间",
            dataIndex: "create_time",
            key: "create_time",
            sorter: true,
            sortOrder:
                tableParams.sortField === "create_time"
                    ? tableParams.sortOrder
                    : null,
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "最近活动",
            dataIndex: "last_login_time",
            key: "last_login_time",
            sorter: true,
            sortOrder:
                tableParams.sortField === "last_login_time"
                    ? tableParams.sortOrder
                    : null,
            render: (text) =>
                text ? new Date(text).toLocaleString() : "无记录",
        },
        {
            title: "操作",
            key: "action",
            width: 180,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        disabled={
                            adminStore?.user.roles[0] !== "SUPER_ADMIN" &&
                            record.role === "ADMIN"
                        }
                    >
                        编辑
                    </Button>

                    <Dropdown
                        menu={{ items: moreActionsItems(record) }}
                        trigger={["click"]}
                    >
                        <Button size="small" icon={<MoreOutlined />} />
                    </Dropdown>

                    <Popconfirm
                        title={`确定要${record.status === "active" ? "禁用" : "激活"}该用户吗？`}
                        onConfirm={() =>
                            handleStatusChange(
                                record.id,
                                record.status === "active"
                                    ? "disabled"
                                    : "active",
                            )
                        }
                        disabled={
                            adminStore?.user.roles[0] !== "SUPER_ADMIN" &&
                            record.role === "ADMIN"
                        }
                    >
                        <Button
                            size="small"
                            danger={record.status === "active"}
                            icon={
                                record.status === "active" ? (
                                    <StopOutlined />
                                ) : (
                                    <CheckCircleOutlined />
                                )
                            }
                            disabled={
                                adminStore?.user.id === record.id ||
                                (record.role === "ADMIN" &&
                                    adminStore?.user.roles[0] !== "SUPER_ADMIN")
                            }
                        >
                            {record.status === "active" ? "禁用" : "激活"}
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="确定要删除该用户吗？"
                        onConfirm={() => handleDelete(record.id)}
                        disabled={
                            adminStore?.user.id === record.id ||
                            (record.role === "ADMIN" &&
                                adminStore?.user.roles[0] !== "SUPER_ADMIN")
                        }
                    >
                        <Button
                            size="small"
                            danger
                            icon={<CloseOutlined />}
                            disabled={
                                adminStore?.user.id === record.id ||
                                (record.role === "ADMIN" &&
                                    adminStore?.user.roles[0] !== "SUPER_ADMIN")
                            }
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="rounded-lg bg-white">
            <Spin spinning={loading.users || loading.communities}>
                <div className="mb-4 flex justify-between">
                    {/* 搜索框 */}
                    <Form form={searchForm} layout="inline">
                        <Form.Item name="keyword" label="关键词">
                            <Input placeholder="用户名" allowClear />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                onClick={fetchUsers}
                                loading={loading.users}
                                icon={<SearchOutlined />}
                            >
                                搜索
                            </Button>
                            <Button
                                style={{ marginLeft: 8 }}
                                onClick={handleResetFilters}
                                icon={<CloseOutlined />}
                            >
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                    <Space>
                        {/* 批量操作框 */}
                        {hasSelected && (
                            <>
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    onClick={() =>
                                        handleBatchStatusChange("active")
                                    }
                                >
                                    批量激活
                                </Button>
                                <Button
                                    icon={<StopOutlined />}
                                    danger
                                    onClick={() =>
                                        handleBatchStatusChange("disabled")
                                    }
                                >
                                    批量禁用
                                </Button>
                                <Popconfirm
                                    title="确定要删除选中的用户吗？"
                                    onConfirm={handleBatchDelete}
                                >
                                    <Button icon={<CloseOutlined />} danger>
                                        批量删除
                                    </Button>
                                </Popconfirm>
                                <span style={{ marginLeft: 8 }}>
                                    已选择 {selectedRowKeys.length} 项
                                </span>
                            </>
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditingUser(null);
                                setIsModalVisible(true);
                            }}
                        >
                            添加用户
                        </Button>
                        <Button
                            icon={<SyncOutlined />}
                            onClick={() => {
                                setLoading((prev) => ({
                                    ...prev,
                                    users: true,
                                    communities: true,
                                }));
                                loadInitialData();
                            }}
                        >
                            刷新
                        </Button>
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    rowSelection={rowSelection}
                    pagination={tableParams.pagination}
                    bordered
                    onChange={handleTableChange}
                    scroll={{ x: 1300 }}
                />
                {/* 编辑和创建用户模态框 */}
                <Modal
                    title={editingUser ? "编辑用户" : "添加用户"}
                    open={isModalVisible}
                    onOk={handleSubmit}
                    onCancel={handleCancel}
                    width={800}
                    destroyOnClose
                    forceRender
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onValuesChange={(_changedValues, values) => {
                            if (values.role === "MODERATOR") {
                                setTargetCommunities(
                                    editingUser?.managed_communities.map(
                                        (c) => c.id,
                                    ) || [],
                                );
                                setCommunityTransferVisible(true);
                            } else {
                                setCommunityTransferVisible(false);
                            }
                        }}
                    >
                        <Form.Item
                            name="username"
                            label="用户名"
                            rules={[
                                { required: true, message: "请输入用户名" },
                                { min: 4, message: "用户名至少4个字符" },
                                { max: 16, message: "用户名最多16个字符" },
                            ]}
                        >
                            <Input placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="邮箱"
                            rules={[
                                { required: true, message: "请输入邮箱" },
                                {
                                    type: "email",
                                    message: "请输入有效的邮箱地址",
                                },
                            ]}
                        >
                            <Input placeholder="请输入邮箱" />
                        </Form.Item>
                        {/* 不能编辑自己的角色*/}
                        {adminStore.user &&
                            adminStore.user.id !== editingUser?.id && (
                                <Form.Item
                                    name="role"
                                    label="角色"
                                    rules={[
                                        {
                                            required: true,
                                            message: "请选择角色",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="请选择角色"
                                        onChange={(value) => {
                                            if (value !== "MODERATOR") {
                                                setTargetCommunities([]);
                                            }
                                        }}
                                    >
                                        {/*只有超级管理员可以创建管理员*/}
                                        {adminStore.user.roles[0] ===
                                            "SUPER_ADMIN" && (
                                            <Select.Option value="ADMIN">
                                                管理员
                                            </Select.Option>
                                        )}
                                        <Select.Option value="MODERATOR">
                                            版主
                                        </Select.Option>
                                        <Select.Option value="USER">
                                            普通用户
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            )}
                        {editingUser &&
                            adminStore.user.id !== editingUser.id && (
                                <Form.Item
                                    name="status"
                                    label="状态"
                                    rules={[
                                        {
                                            required: true,
                                            message: "请选择状态",
                                        },
                                    ]}
                                >
                                    <Select placeholder="请选择状态">
                                        <Select.Option value="active">
                                            活跃
                                        </Select.Option>
                                        <Select.Option value="inactive">
                                            禁用
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            )}

                        {communityTransferVisible && (
                            <>
                                <Divider
                                    orientation="left"
                                    orientationMargin={0}
                                >
                                    <Space>
                                        <TeamOutlined />
                                        <span>管理社区分配</span>
                                    </Space>
                                </Divider>
                                <Transfer
                                    dataSource={allCommunities}
                                    targetKeys={targetCommunities}
                                    onChange={handleCommunityTransferChange}
                                    render={renderCommunityItem}
                                    listStyle={{
                                        width: 350,
                                        height: 300,
                                    }}
                                    titles={["可选社区", "已分配社区"]}
                                    showSearch
                                    filterOption={(inputValue, item) =>
                                        item.title.indexOf(inputValue) !== -1 ||
                                        item.description.indexOf(inputValue) !==
                                            -1
                                    }
                                    oneWay
                                />
                            </>
                        )}
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
};

export default UserManage;
