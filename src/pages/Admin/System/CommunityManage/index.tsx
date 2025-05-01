import { useState, useEffect } from "react";
import {
    Table,
    Tag,
    Input,
    Button,
    Space,
    Modal,
    Form,
    Select,
    message,
    Badge,
    Popconfirm,
    Divider,
    Typography,
    Descriptions,
    Tabs,
    TablePaginationConfig,
    Image,
    Col,
    Upload,
    Spin,
    Row,
} from "antd";
import {
    TeamOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    DownloadOutlined,
    UserOutlined,
    SettingOutlined,
    StopOutlined,
    CheckCircleOutlined, FireOutlined
} from "@ant-design/icons";
import type { TableProps, TabsProps } from "antd";
import { FilterValue, SorterResult, SortOrder } from "antd/es/table/interface";
import {
    AdminCommunity,
    Category,
    communityApi,
    CommunityQueryParams,
} from "@/api/community";
import CommunityMembers from "./CommunityMembers";
import CommunityModerators from "./CommunityModerators";
import CommunityStats from "./CommunityStats";
import { UploadChangeParam } from "antd/es/upload";
import ImgCrop from "antd-img-crop";

const { Text } = Typography;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: SortOrder;
    filters?: Record<string, FilterValue | null>;
}

const CommunityManage = () => {
    // 状态管理
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sortField: "created_at",
        sortOrder: "descend",
    });

    const [communities, setCommunities] = useState<AdminCommunity[]>([]);
    // 加载状态
    const [loading, setLoading] = useState({
        table: false,
        submitting: false,
        batch: false,
    });
    // 选择ids
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 弹窗状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 编辑的社区
    const [editingCommunity, setEditingCommunity] =
        useState<AdminCommunity | null>(null);
    //  详情弹窗
    const [detailVisible, setDetailVisible] = useState(false);
    const [currentCommunity, setCurrentCommunity] =
        useState<AdminCommunity | null>(null);
    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();

    // 游戏类别选项
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

    // 加载社区数据
    const fetchCommunities = async () => {
        try {
            setLoading((prev) => ({ ...prev, table: true }));

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

            const data = await communityApi.getCommunities(params);

            setCommunities(data.items);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.total,
                },
            });
        } catch (error) {
            message.error(
                error instanceof Error ? error.message : "获取社区列表失败",
            );
        } finally {
            setLoading((prev) => ({ ...prev, table: false }));
        }
    };
    // 获取社区类型
    const fetchCategories = async () => {
        try {
            const categories = await communityApi.getCommunityCategories();

            setCategoryOptions([...categories]);
        } catch (error) {
            message.error(
                error instanceof Error ? error.message : "获取社区类别失败",
            );
        }
    };
    // 初始化加载数据
    useEffect(() => {
        fetchCommunities();
    }, [JSON.stringify(tableParams)]);
    useEffect(() => {
        fetchCategories();
    }, []);
    // 表格变化处理
    const handleTableChange: TableProps<AdminCommunity>["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        setTableParams({
            pagination,
            filters,
            sortField: (sorter as SorterResult<AdminCommunity>).field as string,
            sortOrder: (sorter as SorterResult<AdminCommunity>).order,
        });
    };

    // 显示详情
    const showDetail = (community: AdminCommunity) => {
        setCurrentCommunity(community);
        setDetailVisible(true);
    };

    // 提交表单
    const handleSubmit = async () => {
        try {
            setLoading((prev) => ({ ...prev, submitting: true }));
            const values = await form.validateFields();

            if (editingCommunity) {
                const updated = await communityApi.updateCommunity(
                    editingCommunity.id,
                    values,
                );
                setCommunities((prev) =>
                    prev.map((c) =>
                        c.id === editingCommunity.id ? updated : c,
                    ),
                );
                message.success("社区更新成功");
            } else {
                const newCommunity = await communityApi.createCommunity(values);
                setCommunities((prev) => [...prev, newCommunity]);
                message.success("社区创建成功");
            }

            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(error instanceof Error ? error.message : "操作失败");
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };

    // 上传检测
    const beforeUpload = (file: File) => {
        const isImage =
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/gif" ||
            file.type === "image/webp" ||
            file.type === "image/svg+xml" ||
            file.type === "image/bmp" ||
            file.type === "image/x-icon";
        if (!isImage) {
            message.error("不支持的图片格式!");
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(" 图片大小不能超过2MB!");
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    //上传社区图片
    const handleUploadChange = (info: UploadChangeParam) => {
        if (info.file.status === "uploading") {
            setLoading((prev) => ({ ...prev, submitting: true }));
            return;
        }
        if (info.file.status === "done") {
            // 假设后端返回格式为 { url: '图片地址' }

            form.setFieldsValue({ game_img_url: info.file.response.data });
            setLoading((prev) => ({ ...prev, submitting: false }));
            message.success(" 图片上传成功");
        } else if (info.file.status === "error") {
            setLoading((prev) => ({ ...prev, submitting: false }));
            message.error(" 图片上传失败");
        }
    };
    // 批量操作
    const handleBatchAction = async (
        action: "activate" | "disabled" | "delete",
    ) => {
        if (selectedRowKeys.length === 0) {
            message.warning("请至少选择一项");
            return;
        }

        try {
            setLoading((prev) => ({ ...prev, batch: true }));

            switch (action) {
                case "activate":
                    await communityApi.batchUpdateStatus(
                        selectedRowKeys as string[],
                        "active",
                    );
                    message.success(`已激活${selectedRowKeys.length}个社区`);
                    break;
                case "disabled":
                    await communityApi.batchUpdateStatus(
                        selectedRowKeys as string[],
                        "disabled",
                    );
                    message.success(`已停用${selectedRowKeys.length}个社区`);
                    break;
                case "delete":
                    await communityApi.batchDelete(selectedRowKeys as string[]);
                    message.success(`已删除${selectedRowKeys.length}个社区`);
                    break;
            }

            setSelectedRowKeys([]);
            fetchCommunities();
        } catch (error) {
            message.error(
                error instanceof Error ? error.message : "批量操作失败",
            );
        } finally {
            setLoading((prev) => ({ ...prev, batch: false }));
        }
    };

    // 表格列定义
    const columns: TableProps<AdminCommunity>["columns"] = [
        {
            title: "社区名称",
            dataIndex: "title",
            key: "title",
            sorter: true,
            sortOrder:
                tableParams.sortField === "title"
                    ? tableParams.sortOrder
                    : null,
            render: (text, record) => (
                <Button type="link" onClick={() => showDetail(record)}>
                    {text}
                </Button>
            ),
        },
        {
            title: "热门度",
            dataIndex: "hot_point",
            key: "hot_point",
            sorter: true,
            sortOrder: tableParams.sortField  === "hot_point" ? tableParams.sortOrder  : null,
            render: (hot_point: number) => {
                // 根据热度值确定颜色和等级
                let color = '';
                let level = '';

                if (hot_point >= 1000) {
                    color = '#f5222d'; // 红
                    level = '爆热';
                } else if (hot_point >= 500) {
                    color = '#fa541c'; // 橙红
                    level = '热门';
                } else if (hot_point >= 200) {
                    color = '#fa8c16'; // 橙
                    level = '活跃';
                } else if (hot_point >= 100) {
                    color = '#faad14'; // 黄
                    level = '温热';
                } else {
                    color = '#d9d9d9'; // 灰
                    level = '一般';
                }

                return (
                    <Tag
                        color={color}
                        style={{
                            fontWeight: 500,
                            borderRadius: 12,
                            padding: '0 8px',
                            minWidth: 50,
                            textAlign: 'center'
                        }}
                    >
                        {hot_point} {hot_point >= 100 && <FireOutlined />}
                    </Tag>
                );
            },
        },
        {
            title: "游戏类型",
            dataIndex: "category",
            key: "category",
            filters: categoryOptions?.map((opt) => ({
                text: opt.label,
                value: opt.value,
            })),
            filteredValue: tableParams.filters?.category || null,
            render: (category: string[]) =>
                category.map((c) => (
                    <Tag key={c} color="blue">
                        {c}
                    </Tag>
                )),
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "活跃", value: "active" },
                { text: "停用", value: "disabled" },
            ],
            filteredValue: tableParams.filters?.status || null,
            render: (status) => (
                <Badge
                    status={status === "active" ? "success" : "error"}
                    text={status === "active" ? "活跃" : "停用"}
                />
            ),
        },
        {
            title: "成员/版主",
            key: "members",
            render: (_, record) => (
                <Space>
                    <Text type="secondary">
                        <UserOutlined /> {record.member_count}
                    </Text>
                    <Text type="secondary">
                        <SettingOutlined /> {record.moderator_count}
                    </Text>
                </Space>
            ),
            sorter: (a, b) => a.member_count - b.member_count,
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            key: "created_at",
            sorter: true,
            sortOrder:
                tableParams.sortField === "created_at"
                    ? tableParams.sortOrder
                    : null,
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "操作",
            key: "action",
            width: 200,
            render: (_, record) => <ActionButtons record={record} />,
        },
    ];

    // 操作按钮组件
    const ActionButtons = ({ record }: { record: AdminCommunity }) => {
        const [loading, setLoading] = useState(false);
        // 改变社区状态
        const handleStatusChange = async () => {
            try {
                setLoading(true);
                const newStatus =
                    record.status === "active" ? "disabled" : "active";
                await communityApi.batchUpdateStatus([record.id],
                     newStatus
                );
                setCommunities((prev) =>
                    prev.map((c) => (c.id === record.id ? {...c, status: newStatus} : c)),
                );
                message.success(
                    `社区已${newStatus === "active" ? "激活" : "停用"}`,
                );
            } catch (error) {
                message.error(
                    error instanceof Error ? error.message : "操作失败",
                );
            } finally {
                setLoading(false);
            }
        };
        // 删除社区
        const handleDelete = async () => {
            try {
                setLoading(true);
                await communityApi.batchDelete([record.id]);
                setCommunities((prev) =>
                    prev.filter((c) => c.id !== record.id),
                );
                message.success("社区已删除");
            } catch (error) {
                message.error(
                    error instanceof Error ? error.message : "删除失败",
                );
            } finally {
                setLoading(false);
            }
        };

        return (
            <Space size="middle">
                <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setEditingCommunity(record);
                        form.setFieldsValue(record);
                        setIsModalVisible(true);
                    }}
                >
                    编辑
                </Button>

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
                    onClick={handleStatusChange}
                    loading={loading}
                >
                    {record.status === "active" ? "停用" : "激活"}
                </Button>

                <Popconfirm
                    title="确定要删除这个社区吗？"
                    description="删除后将无法恢复，所有相关数据也将被清除。"
                    onConfirm={handleDelete}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button size="small" danger loading={loading}>
                        删除
                    </Button>
                </Popconfirm>
            </Space>
        );
    };

    // 详情页标签页
    const detailTabs: TabsProps["items"] = [
        {
            key: "stats",
            label: "统计数据",
            children: currentCommunity && (
                <CommunityStats community={currentCommunity} />
            ),
        },
        {
            key: "members",
            label: "成员管理",
            children: currentCommunity && (
                <CommunityMembers communityId={currentCommunity.id} />
            ),
        },
        {
            key: "moderators",
            label: "版主管理",
            children: currentCommunity && (
                <CommunityModerators communityId={currentCommunity.id} />
            ),
        },
    ];

    return (
        <div className="community-management">
            <div className="mb-4 flex justify-between">
                {/* 搜索和筛选卡片 */}
                <Form
                    form={searchForm}
                    layout="inline"
                    onFinish={fetchCommunities}
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
                                    pagination: { current: 1, pageSize: 10 },
                                    filters: {},
                                    sortField: null,
                                    sortOrder: "descend",
                                });
                            }}
                        >
                            重置
                        </Button>
                    </Form.Item>
                </Form>
                {/* 社区表格 */}
                <Space>
                    {/* 批量操作工具栏 */}
                    {selectedRowKeys.length > 0 && (
                        <div className="batch-actions-bar">
                            <Space>
                                <Text>已选择 {selectedRowKeys.length} 项</Text>
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    onClick={() =>
                                        handleBatchAction("activate")
                                    }
                                    loading={loading.batch}
                                >
                                    批量激活
                                </Button>
                                <Button
                                    icon={<StopOutlined />}
                                    danger
                                    onClick={() =>
                                        handleBatchAction("disabled")
                                    }
                                    loading={loading.batch}
                                >
                                    批量停用
                                </Button>
                                <Popconfirm
                                    title="确定要删除选中的社区吗？"
                                    onConfirm={() =>
                                        handleBatchAction("delete")
                                    }
                                >
                                    <Button
                                        icon={<ExclamationCircleOutlined />}
                                        danger
                                        loading={loading.batch}
                                    >
                                        批量删除
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </div>
                    )}
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingCommunity(null);
                            setIsModalVisible(true);
                        }}
                    >
                        新建社区
                    </Button>
                    <Button
                        icon={<SyncOutlined />}
                        onClick={fetchCommunities}
                        loading={loading.table}
                    >
                        刷新
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() => message.info("导出功能待实现")}
                    >
                        导出
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={communities}
                rowKey="id"
                pagination={tableParams.pagination}
                loading={loading.table}
                onChange={handleTableChange}
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                scroll={{ x: 1200 }}
            />

            {/* 社区编辑/创建模态框 */}
            <Modal
                title={editingCommunity ? "编辑社区" : "新建社区"}
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                confirmLoading={loading.submitting}
                width={800} // 增加了宽度以容纳图片上传
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        {/* 左侧：图片上传区域 */}
                        <Col span={12}>
                            <Form.Item
                                name="game_img_url"
                                label="社区封面图"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e?.fileList;
                                }}
                            >
                                <ImgCrop
                                    zoomSlider
                                    showReset
                                    resetText={"重置"}
                                    cropShape={"rect"}
                                    minZoom={1}
                                    quality={0.8}
                                >
                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        showUploadList={false}
                                        action="/api/game/admin-upload-community-img" // 替换为实际的上传接口
                                        onChange={handleUploadChange}
                                        beforeUpload={beforeUpload}
                                        headers={{
                                            Authorization: `Bearer ${localStorage.getItem(
                                                "token",
                                            )}`,
                                        }}
                                    >
                                        {form.getFieldValue("game_img_url") ? (
                                            <img
                                                src={form.getFieldValue(
                                                    "game_img_url",
                                                )}
                                                alt="社区封面"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <div>
                                                {loading.submitting ? (
                                                    <Spin size="small" />
                                                ) : (
                                                    <>
                                                        <PlusOutlined />
                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            上传图片
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </Upload>
                                </ImgCrop>
                                <div
                                    style={{
                                        marginTop: 8,
                                        color: "#999",
                                        fontSize: 12,
                                    }}
                                >
                                    建议尺寸：100x100，支持JPG/PNG格式
                                </div>
                            </Form.Item>
                        </Col>

                        {/* 右侧：表单输入区域 */}
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label="社区名称"
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入社区名称",
                                    },
                                    {
                                        max: 50,
                                        message: "名称不能超过50个字符",
                                    },
                                ]}
                            >
                                <Input placeholder="例如：英雄联盟社区" />
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label="游戏标签"
                                rules={[
                                    {
                                        required: true,
                                        message: "请至少选择一个游戏标签",
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="选择游戏标签（可多选）"
                                    options={categoryOptions}
                                    showSearch
                                    optionFilterProp="label"
                                    maxTagCount="responsive"
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="社区描述"
                        rules={[{ max: 400, message: "描述不能超过400个字符" }]}
                    >
                        <Input.TextArea rows={4} placeholder="请输入社区描述" />
                    </Form.Item>

                    {editingCommunity && (
                        <Form.Item
                            name="status"
                            label="状态"
                            rules={[{ required: true, message: "请选择状态" }]}
                        >
                            <Select placeholder="请选择状态">
                                <Select.Option value="active">
                                    活跃
                                </Select.Option>
                                <Select.Option value="inactive">
                                    停用
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* 社区详情模态框 */}
            <Modal
                title={
                    <Space>
                        <TeamOutlined />
                        <span>{currentCommunity?.title} - 社区详情</span>
                    </Space>
                }
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                {currentCommunity && (
                    <>
                        <div style={{ display: "flex", marginBottom: 24 }}>
                            {/* 社区图像展示 */}
                            {currentCommunity.game_img_url ? (
                                <Image
                                    src={currentCommunity.game_img_url}
                                    alt={currentCommunity.title}
                                    width={100}
                                    height={100}
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: 4,
                                    }}
                                    preview={false}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 150,
                                        height: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        borderRadius: 4,
                                    }}
                                >
                                    <TeamOutlined
                                        style={{ fontSize: 32, color: "#999" }}
                                    />
                                </div>
                            )}

                            {/* 社区基本信息 */}
                            <div style={{ marginLeft: 24, flex: 1 }}>
                                <Typography.Title
                                    level={4}
                                    style={{ marginBottom: 8 }}
                                >
                                    {currentCommunity.title}
                                </Typography.Title>
                                <Space size={16}>
                                    <Badge
                                        status={
                                            currentCommunity.status === "active"
                                                ? "success"
                                                : "error"
                                        }
                                        text={
                                            currentCommunity.status === "active"
                                                ? "活跃"
                                                : "停用"
                                        }
                                    />
                                    <span>
                                        <UserOutlined />{" "}
                                        {currentCommunity.member_count} 成员
                                    </span>
                                    <span>
                                        <SettingOutlined />{" "}
                                        {currentCommunity.moderator_count} 版主
                                    </span>
                                </Space>
                            </div>
                        </div>

                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="游戏类别">
                                {currentCommunity.category.map((c, index) => (
                                    <Tag color="blue" key={index}>
                                        {categoryOptions.find(
                                            (opt) => opt.value === c,
                                        )?.label || c}
                                    </Tag>
                                ))}
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间">
                                {new Date(
                                    currentCommunity.created_at,
                                ).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="最后更新">
                                {currentCommunity.last_updated_at
                                    ? new Date(
                                          currentCommunity.last_updated_at,
                                      ).toLocaleString()
                                    : "无记录"}
                            </Descriptions.Item>
                            <Descriptions.Item label="描述" span={2}>
                                {currentCommunity.description || "暂无描述"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Tabs defaultActiveKey="stats" items={detailTabs} />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CommunityManage;
