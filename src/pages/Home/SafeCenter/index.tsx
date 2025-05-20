import {
    Card,
    Flex,
    Typography,
    Button,
    Divider,
    Badge,
    Switch,
    Modal,
    Form,
    Input,
    message,
} from "antd";
import {
    LockOutlined,
    SafetyOutlined,
    UserOutlined,
    MobileOutlined,
    MailOutlined,
    LogoutOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import useUserStore from "@/stores/useUserStore.tsx";
import {
    safeApi,
    UpdateEmailParams,
    UpdatePasswordParams,
    UpdatePhoneParams,
} from "@/api/safe.api";

const { Text } = Typography;

export default function SafeCenter() {
    const userInfo = useUserStore((state) => state.user);
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const [passwordForm] = Form.useForm();
    const [phoneForm] = Form.useForm();
    const [emailForm] = Form.useForm();
    const [usernameForm] = Form.useForm();
    const [verifyMethod, setVerifyMethod] = useState<"phone" | "email">(
        "email",
    );
    const [codeLoading, setCodeLoading] = useState(false);
    const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(
        null,
    );

    // 检查是否可以修改用户名
    const canChangeUsername = () => {
        if (!lastUsernameChange) return true;
        const now = new Date();
        const lastChange = new Date(lastUsernameChange);
        const diffTime = Math.abs(now.getTime() - lastChange.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
    };

    const handleUsernameSubmit = async (values: any) => {
        try {
            if (!canChangeUsername()) {
                message.error("每周只能修改一次用户名");
                return;
            }

            await safeApi.updateUsername({
                newUsername: values.newUsername,
            });

            message.success("用户名修改成功");
            setUsernameModalVisible(false);
            setLastUsernameChange(new Date());
            useUserStore.getState().refreshUser();
        } catch (error) {
            message.error(error.message);
        }
    };
    const handleGetCode = async () => {
        try {
            setCodeLoading(true);
            let account = "";
            let method: string | null;
            if (passwordModalVisible) {
                if (verifyMethod === "phone") {
                    account = userInfo.phone;
                } else {
                    account = userInfo.email;
                }
                await safeApi.sendVerifyCode({
                    type: verifyMethod,
                    account: "password",
                });
            }
            if (phoneModalVisible) {
                if (userInfo.phone) {
                    account = phoneForm.getFieldValue("originalPhone");
                } else {
                    account = phoneForm.getFieldValue("newPhone");
                    if (!account) {
                        message.error("请输入手机号");
                        return;
                    }
                }

                await safeApi.sendVerifyCode({ type: "phone", account });
            }
            if (emailModalVisible) {
                if (userInfo.email) {
                    account = emailForm.getFieldValue("originalEmail");
                } else {
                    account = emailForm.getFieldValue("newEmail");
                    if (!account) {
                        message.error("请输入邮箱");
                        return;
                    }
                }
                method = "email";
                await safeApi.sendVerifyCode({ type: "email", account });
            }

            message.success("验证码发送成功");
        } catch (error) {
            message.error(error.message);
        } finally {
            setCodeLoading(false);
        }
    };
    const handlePasswordSubmit = async (values: any) => {
        try {
            const params: UpdatePasswordParams = userInfo.is_default_password
                ? {
                      newPassword: values.newPassword,
                      confirmPassword: values.confirmPassword,
                      code: values.code,
                  }
                : {
                      oldPassword: values.oldPassword,
                      newPassword: values.newPassword,
                      confirmPassword: values.confirmPassword,
                  };

            if (
                !userInfo.is_default_password &&
                values.newPassword !== values.confirmPassword
            ) {
                message.error("两次输入的新密码不一致");
                return;
            }

            await safeApi.updatePassword(params);
            message.success("密码修改成功");
            setPasswordModalVisible(false);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handlePhoneSubmit = async (values: any) => {
        try {
            const params: UpdatePhoneParams = {
                originalPhone: values.originalPhone,
                newPhone: values.newPhone,
                code: values.code,
            };
            await safeApi.updatePhone(params);
            message.success(
                userInfo.phone ? "手机号修改成功" : "手机号绑定成功",
            );
            setPhoneModalVisible(false);
            useUserStore.getState().refreshUser();
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleEmailSubmit = async (values: any) => {
        try {
            const params: UpdateEmailParams = {
                originalEmail: values.originalEmail,
                newEmail: values.newEmail,
                code: values.code,
            };
            await safeApi.updateEmail(params);
            message.success(userInfo.email ? "邮箱修改成功" : "邮箱绑定成功");
            setEmailModalVisible(false);
            useUserStore.getState().refreshUser();
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <Card title="安全中心" bordered={false}>
            <Flex vertical gap="large">
                {/* 账号安全 */}
                <Card
                    title={
                        <Flex align="center" gap={8}>
                            <SafetyOutlined />
                            <Text strong>账号安全</Text>
                        </Flex>
                    }
                    extra={<Badge status="success" text="安全" />}
                >
                    <Flex vertical gap="middle">
                        {/* 新增用户名修改项 */}
                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={8}>
                                <UserOutlined />
                                <Text>用户名</Text>
                            </Flex>
                            <Flex gap={8} align="center">
                                <Text>{userInfo.username}</Text>
                                <Button
                                    type="link"
                                    onClick={() =>
                                        setUsernameModalVisible(true)
                                    }
                                    disabled={!canChangeUsername()}
                                >
                                    {canChangeUsername()
                                        ? "修改"
                                        : "7天内已修改"}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={8}>
                                <MobileOutlined />
                                <Text>手机绑定</Text>
                            </Flex>
                            {userInfo.phone ? (
                                <Flex gap={8} align="center">
                                    <Text type="success">
                                        已绑定 (+86){" "}
                                        {userInfo.phone.replace(
                                            /(\d{3})\d{4}(\d{4})/,
                                            "$1****$2",
                                        )}
                                    </Text>
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            setPhoneModalVisible(true)
                                        }
                                    >
                                        修改
                                    </Button>
                                </Flex>
                            ) : (
                                <Button
                                    type="link"
                                    onClick={() => setPhoneModalVisible(true)}
                                >
                                    未绑定
                                </Button>
                            )}
                        </Flex>

                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={8}>
                                <MailOutlined />
                                <Text>邮箱绑定</Text>
                            </Flex>
                            {userInfo.email ? (
                                <Flex gap={8} align="center">
                                    <Text type="success">
                                        已绑定{" "}
                                        {userInfo.email.replace(
                                            /(\w{3})[\w.-]+@([\w.]+\w)/,
                                            "$1***@$2",
                                        )}
                                    </Text>
                                    <Button
                                        type="link"
                                        onClick={() =>
                                            setEmailModalVisible(true)
                                        }
                                    >
                                        修改
                                    </Button>
                                </Flex>
                            ) : (
                                <Button
                                    type="link"
                                    onClick={() => setEmailModalVisible(true)}
                                >
                                    未绑定
                                </Button>
                            )}
                        </Flex>

                        <Flex justify="space-between" align="center">
                            <Flex align="center" gap={8}>
                                <LockOutlined />
                                <Text>密码修改</Text>
                            </Flex>
                            <Button
                                type="link"
                                onClick={() => setPasswordModalVisible(true)}
                            >
                                修改
                            </Button>
                        </Flex>
                    </Flex>
                </Card>

                {/*/!* 隐私设置 *!/*/}
                {/*<Card*/}
                {/*    title={*/}
                {/*        <Flex align="center" gap={8}>*/}
                {/*            <EyeInvisibleOutlined />*/}
                {/*            <Text strong>隐私设置</Text>*/}
                {/*        </Flex>*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Flex vertical gap="middle">*/}
                {/*        <Flex justify="space-between" align="center">*/}
                {/*            <Text>公开个人资料</Text>*/}
                {/*            <Switch defaultChecked />*/}
                {/*        </Flex>*/}

                {/*        <Flex justify="space-between" align="center">*/}
                {/*            <Text>允许陌生人查看您的收藏</Text>*/}
                {/*            <Switch defaultChecked />*/}
                {/*        </Flex>*/}

                {/*        <Flex justify="space-between" align="center">*/}
                {/*            <Text>允许陌生人查看您的关注</Text>*/}
                {/*            <Switch />*/}
                {/*        </Flex>*/}
                {/*    </Flex>*/}
                {/*</Card>*/}

                {/*/!* 登录设备管理 *!/*/}
                {/*<Card*/}
                {/*    title={*/}
                {/*        <Flex align="center" gap={8}>*/}
                {/*            <UserOutlined />*/}
                {/*            <Text strong>登录设备管理</Text>*/}
                {/*        </Flex>*/}
                {/*    }*/}
                {/*>*/}
                {/*    <Flex vertical gap="middle">*/}
                {/*        <Flex justify="space-between" align="center">*/}
                {/*            <Flex vertical>*/}
                {/*                <Text strong>Windows 10 · Chrome</Text>*/}
                {/*                <Text type="secondary">当前设备 · 北京</Text>*/}
                {/*            </Flex>*/}
                {/*            <Button type="text" disabled>*/}
                {/*                当前设备*/}
                {/*            </Button>*/}
                {/*        </Flex>*/}

                {/*        <Divider />*/}

                {/*        <Flex justify="space-between" align="center">*/}
                {/*            <Flex vertical>*/}
                {/*                <Text>iPhone 13 · Safari</Text>*/}
                {/*                <Text type="secondary">*/}
                {/*                    2023-12-15 14:30 · 上海*/}
                {/*                </Text>*/}
                {/*            </Flex>*/}
                {/*            <Button*/}
                {/*                danger*/}
                {/*                type="text"*/}
                {/*                icon={<LogoutOutlined />}*/}
                {/*            >*/}
                {/*                退出*/}
                {/*            </Button>*/}
                {/*        </Flex>*/}
                {/*    </Flex>*/}
                {/*</Card>*/}
            </Flex>

            {/* 用户名修改弹窗 */}
            <Modal
                title="修改用户名"
                open={usernameModalVisible}
                onCancel={() => setUsernameModalVisible(false)}
                footer={null}
            >
                <Form form={usernameForm} onFinish={handleUsernameSubmit}>
                    <Form.Item
                        name="newUsername"
                        rules={[
                            { required: true, message: "请输入新用户名" },
                            { min: 4, message: "用户名至少4个字符" },
                            { max: 20, message: "用户名最多20个字符" },
                        ]}
                    >
                        <Input
                            placeholder="请输入新用户名"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        确认
                    </Button>
                </Form>
            </Modal>
            {/* 手机绑定弹窗 */}
            <Modal
                title={userInfo.phone ? "修改手机号" : "绑定手机号"}
                open={phoneModalVisible}
                onCancel={() => setPhoneModalVisible(false)}
                footer={null}
            >
                <Form form={phoneForm} onFinish={handlePhoneSubmit}>
                    {userInfo.phone && (
                        <Form.Item
                            name="originalPhone"
                            rules={[
                                { required: true, message: "请输入原手机号" },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: "手机号格式不正确",
                                },
                            ]}
                        >
                            <Input
                                placeholder="请输入原手机号"
                                prefix={<MobileOutlined />}
                            />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="newPhone"
                        rules={[
                            { required: true, message: "请输入新手机号" },
                            {
                                pattern: /^1\d{10}$/,
                                message: "手机号格式不正确",
                            },
                        ]}
                    >
                        <Input
                            placeholder="请输入新手机号"
                            prefix={<MobileOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmNewPhone"
                        rules={[
                            { required: true, message: "请确认新手机号" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPhone") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("两次输入的手机号不一致"),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input
                            placeholder="请确认新手机号"
                            prefix={<MobileOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: "请输入验证码" }]}
                    >
                        <Flex gap={8}>
                            <Input placeholder="请输入验证码" />
                            <Button
                                loading={codeLoading}
                                onClick={handleGetCode}
                            >
                                获取验证码
                            </Button>
                        </Flex>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        确认
                    </Button>
                </Form>
            </Modal>

            {/* 邮箱绑定弹窗 */}
            <Modal
                title={userInfo.email ? "修改邮箱" : "绑定邮箱"}
                open={emailModalVisible}
                onCancel={() => setEmailModalVisible(false)}
                footer={null}
            >
                <Form form={emailForm} onFinish={handleEmailSubmit}>
                    {userInfo.email && (
                        <Form.Item
                            name="originalEmail"
                            rules={[
                                { required: true, message: "请输入原邮箱" },
                                { type: "email", message: "邮箱格式不正确" },
                            ]}
                        >
                            <Input
                                placeholder="请输入原邮箱"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="newEmail"
                        rules={[
                            { required: true, message: "请输入新邮箱" },
                            { type: "email", message: "邮箱格式不正确" },
                        ]}
                    >
                        <Input
                            placeholder="请输入新邮箱"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmNewEmail"
                        rules={[
                            { required: true, message: "请确认新邮箱" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newEmail") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("两次输入的邮箱不一致"),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input
                            placeholder="请确认新邮箱"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: "请输入验证码" }]}
                    >
                        <Flex gap={8}>
                            <Input placeholder="请输入验证码" />
                            <Button
                                loading={codeLoading}
                                onClick={handleGetCode}
                            >
                                获取验证码
                            </Button>
                        </Flex>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        确认
                    </Button>
                </Form>
            </Modal>

            {/* 密码修改弹窗 */}
            <Modal
                title="修改密码"
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
            >
                <Form form={passwordForm} onFinish={handlePasswordSubmit}>
                    {!userInfo.is_default_password && (
                        <Form.Item
                            name="oldPassword"
                            rules={[
                                { required: true, message: "请输入原密码" },
                            ]}
                        >
                            <Input.Password
                                placeholder="请输入原密码"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="newPassword"
                        rules={[{ required: true, message: "请输入新密码" }]}
                    >
                        <Input.Password
                            placeholder="请输入新密码"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        rules={[{ required: true, message: "请确认新密码" }]}
                    >
                        <Input.Password
                            placeholder="请确认新密码"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>
                    {userInfo.is_default_password && (
                        <>
                            <Form.Item label="验证方式">
                                <Flex gap={8}>
                                    <Button
                                        type={
                                            verifyMethod === "email"
                                                ? "primary"
                                                : "default"
                                        }
                                        onClick={() => setVerifyMethod("email")}
                                        disabled={!userInfo.email}
                                    >
                                        邮箱验证
                                    </Button>
                                </Flex>
                            </Form.Item>
                            <Form.Item
                                name="code"
                                rules={[
                                    { required: true, message: "请输入验证码" },
                                ]}
                            >
                                <Flex gap={8}>
                                    <Input
                                        placeholder={`请输入${verifyMethod === "phone" ? "手机" : "邮箱"}验证码`}
                                    />
                                    <Button
                                        loading={codeLoading}
                                        onClick={handleGetCode}
                                    >
                                        获取验证码
                                    </Button>
                                </Flex>
                            </Form.Item>
                        </>
                    )}
                    <Button type="primary" htmlType="submit" block>
                        确认修改
                    </Button>
                </Form>
            </Modal>
        </Card>
    );
}
