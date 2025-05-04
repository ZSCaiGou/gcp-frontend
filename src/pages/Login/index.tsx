import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from "@ant-design/icons";
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from "@ant-design/pro-components";
import { Space, Tabs, message, theme, Button, Flex } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import { LoginType, LoginUserDto } from "@/interface/user.ts";
import { getVerifyCode, loginUser } from "@/api/user.api.ts";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";

export default function Login() {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>("verifyCode");
    const initUser = useUserStore((state) => state.initUser);
    const userInfo = useUserStore((state) => state.user);
    const navigate = useNavigate();
    const iconStyles: CSSProperties = {
        marginInlineStart: "16px",
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: "24px",
        verticalAlign: "middle",
        cursor: "pointer",
    };
    // 登录
    const handleLogin = async (values: {
        username: string;
        password: string;
    }) => {
        const { username, password } = values;
        // 登录逻辑
        // 如果用户名中包含@，则认为是邮箱登录，否则认为是用户名登录

        const loginData: LoginUserDto = {
            account: username,
            password: password,
            type: loginType,
        };
        loginUser(loginData)
            .then(
                (res: {
                    data: { token: string; userId: string; role: string };
                }) => {
                    message.success("登录成功！");

                    localStorage.setItem("token", res.data.token);

                    initUser();
                    navigate("/", { replace: true });
                },
            )
            .catch((err) => {
                message.error(err.message);
            });
    };
    // 获取验证码
    const handleGetCaptcha = (email: string) => {
        getVerifyCode(email)
            .then((res) => {
                message.success("验证码发送成功！");
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    title="GameCP"
                    subTitle="游戏玩家社区平台"
                    actions={
                        <Space>
                            {loginType === "verifyCode" && (
                                <>
                                    <Button variant="text" color={"default"}>
                                        未绑定邮箱号，将会自动注册
                                    </Button>
                                </>
                            )}
                        </Space>
                    }
                    onFinish={handleLogin}
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) =>
                            setLoginType(activeKey as LoginType)
                        }
                    >
                        <Tabs.TabPane key={"verifyCode"} tab={"验证码登录"} />
                        <Tabs.TabPane key={"username"} tab={"账号密码登录"} />
                    </Tabs>
                    {loginType === "username" && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: "large",
                                    prefix: (
                                        <UserOutlined
                                            className={"prefixIcon"}
                                        />
                                    ),
                                }}
                                placeholder={"用户名或邮箱"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入用户名!",
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: "large",
                                    prefix: (
                                        <LockOutlined
                                            className={"prefixIcon"}
                                        />
                                    ),
                                }}
                                placeholder={"密码"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入密码！",
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === "verifyCode" && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: "large",
                                    prefix: (
                                        <MobileOutlined
                                            className={"prefixIcon"}
                                        />
                                    ),
                                }}
                                name="username"
                                placeholder={"邮箱号"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入邮箱号！",
                                    },
                                    {
                                        type: "email",
                                        message: "请输入正确的邮箱号！",
                                    }
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: "large",
                                    prefix: (
                                        <LockOutlined
                                            className={"prefixIcon"}
                                        />
                                    ),
                                }}
                                captchaProps={{
                                    size: "large",
                                }}
                                placeholder={"请输入验证码"}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} ${"获取验证码"}`;
                                    }
                                    return "获取验证码";
                                }}
                                name="password"
                                phoneName={"username"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入验证码！",
                                    },
                                ]}
                                onGetCaptcha={async (username) => {
                                    handleGetCaptcha(username);
                                }}
                            />
                        </>
                    )}
                    <Flex
                        justify="space-between"
                        align="center"
                        style={{ marginBottom: "1em" }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <Button type={"link"}>忘记密码</Button>
                    </Flex>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
}
