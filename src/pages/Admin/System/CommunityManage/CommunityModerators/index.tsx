import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Avatar, Tag, Select } from "antd";
import { UserOutlined, PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { communityApi } from '@/api/community';

interface Moderator {
  id: string;
  username: string;
  avatar?: string;
  role: 'admin' | 'moderator';
  addedAt: string;
}

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
  const [searchValue, setSearchValue] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 加载版主列表
  const fetchModerators = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const data = await communityApi.getModerators(communityId);
      setModerators(data);
    } catch (error) {
      message.error(' 获取版主列表失败');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  // 搜索用户
  const handleSearch = async () => {
    if (!searchValue.trim())  {
      message.warning(' 请输入用户名或ID');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, search: true }));
      const user = await communityApi.searchUser(searchValue);
      form.setFieldsValue({  userId: user.id,  username: user.username  });
      setIsAddModalVisible(true);
    } catch (error) {
      message.error(' 未找到该用户');
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  // 添加版主
  const handleAddModerator = async () => {
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const values = await form.validateFields();

      const newModerator = await communityApi.addModerator(
          communityId,
          values.userId,
          values.role
      );

      setModerators(prev => [...prev, newModerator]);
      message.success(' 版主添加成功');
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error  instanceof Error ? error.message  : '添加失败');
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // 移除版主
  const handleRemoveModerator = async (moderatorId: string) => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      await communityApi.removeModerator(communityId,  moderatorId);
      setModerators(prev => prev.filter(m  => m.id  !== moderatorId));
      message.success(' 版主已移除');
    } catch (error) {
      message.error(' 移除失败');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  useEffect(() => {
    fetchModerators();
  }, [communityId]);

  const columns = [
    {
      title: '版主',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: Moderator) => (
          <Space>
            <Avatar
                src={record.avatar}
                icon={<UserOutlined />}
                size="small"
            />
            <span>{text}</span>
          </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
          <Tag color={role === 'admin' ? 'red' : 'blue'}>
            {role === 'admin' ? '管理员' : '版主'}
          </Tag>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'addedAt',
      key: 'addedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Moderator) => (
          <Popconfirm
              title="确定要移除该版主吗？"
              onConfirm={() => handleRemoveModerator(record.id)}
              okText="确定"
              cancelText="取消"
              disabled={record.role  === 'admin'}
          >
            <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                disabled={record.role  === 'admin'}
            >
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
            <Input
                placeholder="输入用户名或ID"
                prefix={<UserOutlined />}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                style={{ width: 200 }}
            />
            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading.search}
            >
              搜索用户
            </Button>
            <Button
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
            pagination={{ pageSize: 10 }}
            bordered
        />

        <Modal
            title="添加版主"
            open={isAddModalVisible}
            onOk={handleAddModerator}
            onCancel={() => {
              setIsAddModalVisible(false);
              form.resetFields();
            }}
            confirmLoading={loading.submitting}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="username" label="用户名">
              <Input disabled />
            </Form.Item>
            <Form.Item
                name="role"
                label="角色"
                initialValue="moderator"
                rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select>
                <Select.Option value="moderator">普通版主</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default CommunityModerators;