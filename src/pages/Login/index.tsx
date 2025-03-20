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
import { loginUser } from "@/api/user.api.ts";
import { useNavigate } from "react-router";

export default function Login() {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>("phone");
    const navigate = useNavigate();
    const iconStyles: CSSProperties = {
        marginInlineStart: "16px",
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: "24px",
        verticalAlign: "middle",
        cursor: "pointer",
    };
    const handleLogin = async (values: {
        username: string;
        password: string;
    }) => {
        const { username, password } = values;
        // 登录逻辑
        // 如果用户名中包含@，则认为是邮箱登录，否则认为是用户名登录
        if (username !== "phone") {
            if (username.includes("@")) {
                setLoginType("email");
            }
        }
        const loginData: LoginUserDto = {
            account: username,
            password: password,
            type: loginType,
        };
        loginUser(loginData)
            .then((res: { data: { token: string } }) => {
                message.success("登录成功！");
                localStorage.setItem("token", res.data.token);
                return true;
            })
            .catch((err) => {
                message.error(err.message);
                return false;
            });
        navigate("/")

    };
    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    title="GameCP"
                    subTitle="游戏玩家社区平台"
                    actions={
                        <Space>
                            {/*其他登录方式*/}
                            {/*<AlipayCircleOutlined onClick={()=>{message.success("支付宝登录")}} style={iconStyles} />*/}
                            {/*<TaobaoCircleOutlined style={iconStyles} />*/}
                            {/*<WeiboCircleOutlined style={iconStyles} />*/}
                            {loginType === "phone" && (
                                <>
                                    <Button variant="text" color={"default"}>
                                        未绑定手机号，将会自动注册
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
                        <Tabs.TabPane key={"phone"} tab={"手机号登录"} />
                        <Tabs.TabPane key={"username"} tab={"账号密码登录"} />
                    </Tabs>
                    {loginType !== "phone" && (
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
                    {loginType === "phone" && (
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
                                name="mobile"
                                placeholder={"手机号"}
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入手机号！",
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: "手机号格式错误！",
                                    },
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
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: "请输入验证码！",
                                    },
                                ]}
                                onGetCaptcha={async () => {}}
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
