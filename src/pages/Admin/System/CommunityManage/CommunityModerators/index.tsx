import { useState, useEffect } from "react";
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Avatar,
    Tag,
    Select,
    List,
    Spin,
} from "antd";
import {
    UserOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { communityApi, Moderator, UserSearchResult } from "@/api/community";
import type { SearchProps } from "antd/es/input/Search";

interface Props {
    communityId: string;
}



const CommunityModerators = ({ communityId }: Props) => {
    const [moderators, setModerators] = useState<Moderator[]>([]);
    const [loading, setLoading] = useState({
        table: false,
        submitting: false,
        search: false,
    });
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const [form] = Form.useForm();

    const fetchModerators = async () => {
        try {
            setLoading((prev) => ({ ...prev, table: true }));
            const data = await communityApi.getModerators(communityId);
            setModerators(data);
        } catch (error) {
            message.error(" 获取版主列表失败");
        } finally {
            setLoading((prev) => ({ ...prev, table: false }));
        }
    };

    const handleSearch: SearchProps['onSearch'] = async (value) => {
        if (!value.trim())  return;

        try {
            setLoading((prev) => ({ ...prev, search: true }));
            const users = await communityApi.searchUsers(value);
            setSearchResults(users);
            setSelectedUser(null);
        } catch (error) {
            message.error(" 用户搜索失败");
            setSearchResults([]);
        } finally {
            setLoading((prev) => ({ ...prev, search: false }));
        }
    };

    const handleAddModerator = async () => {
        try {
            if (!selectedUser) {
                message.warning(" 请先选择用户");
                return;
            }

            setLoading((prev) => ({ ...prev, submitting: true }));

            const newModerator = await communityApi.addModerator(
                communityId,
                selectedUser.id,
            );

            setModerators((prev) => [...prev, newModerator]);
            message.success(" 版主添加成功");
            setIsAddModalVisible(false);
            form.resetFields();
            setSearchResults([]);
            setSelectedUser(null);
        } catch (error) {
            message.error(error  instanceof Error ? error.message  : "添加失败");
        } finally {
            setLoading((prev) => ({ ...prev, submitting: false }));
        }
    };

    const handleRemoveModerator = async (moderatorId: string) => {
        try {
            setLoading((prev) => ({ ...prev, table: true }));
            await communityApi.removeModerator(communityId,  moderatorId);
            setModerators((prev) => prev.filter((m)  => m.id  !== moderatorId));
            message.success(" 版主已移除");
        } catch (error) {
            message.error(" 移除失败");
        } finally {
            setLoading((prev) => ({ ...prev, table: false }));
        }
    };

    useEffect(() => {
        fetchModerators();
    }, [communityId]);

    const columns = [
        {
            title: "版主",
            dataIndex: "username",
            key: "username",
            render: (text: string, record: Moderator) => (
                <Space>
                    <Avatar
                        src={record.avatar_url}
                        icon={<UserOutlined />}
                        size="small"
                    />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: "角色",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag color={role === "admin" ? "red" : "blue"}>
                    {role === "admin" ? "管理员" : "版主"}
                </Tag>
            ),
        },
        {
            title: "操作",
            key: "action",
            render: (_, record: Moderator) => (
                <Popconfirm
                    title="确定要移除该版主吗？"
                    onConfirm={() => handleRemoveModerator(record.id)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                        移除
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="community-moderators">
            <div className="moderator-actions" style={{ marginBottom: 16 }}>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalVisible(true)}
                    >
                        添加版主
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={moderators}
                rowKey="id"
                loading={loading.table}
                bordered
            />

            <Modal
                title="添加版主"
                open={isAddModalVisible}
                onOk={handleAddModerator}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                    setSearchResults([]);
                    setSelectedUser(null);
                }}
                confirmLoading={loading.submitting}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="搜索用户" required>
                        <Input.Search
                            placeholder="输入用户名或邮箱"
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            loading={loading.search}
                            allowClear
                        />
                    </Form.Item>

                    {searchResults.length  > 0 && (
                        <Form.Item label="搜索结果">
                            <List
                                dataSource={searchResults}
                                renderItem={(user) => (
                                    <List.Item
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: selectedUser?.id === user.id  ? "#f0f7ff" : "inherit",
                                            padding: "8px 12px",
                                            borderRadius: 4,
                                        }}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    src={user.avatar_url}
                                                    icon={<UserOutlined />}
                                                />
                                            }
                                            title={user.username}
                                            description={user.email}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Form.Item>
                    )}

                    {selectedUser && (
                        <>
                            <Form.Item label="已选用户">
                                <Space>
                                    <Avatar src={selectedUser.avatar_url}  />
                                    <span>{selectedUser.username}  ({selectedUser.email})</span>
                                </Space>
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default CommunityModerators;