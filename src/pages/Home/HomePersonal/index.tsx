import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import { LeftOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Checkbox,
    Flex,
    Form,
    Input,
    message,
    Modal,
    Tabs,
    Tag,
    Upload,
} from "antd";
import { Outlet, useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";
import { useEffect, useState } from "react";

interface FormValue {
    phone: string;
    username: string;
    email: string;
    nickname: string;
    signature: string;
}

const getNextLevelEx = (level: number) => {
    if (level < 10) {
        return 100;
    } else if (level < 20) {
        return 500;
    } else if (level < 30) {
        return 1000;
    } else if (level >= 30) {
        return 2000;
    }
};
export default function HomePersonal() {
    const navigate = useNavigate();

    const userInfo = useUserStore((state) => state.user);
    const [editForm] = Form.useForm();

    const [isEdit, setIsEdit] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);

    const [formData, setFormData] = useState<FormValue>();
    // element
    const contentHeader = (
        <Tabs
            onChange={(key) => navigate(key, { replace: true })}
            tabBarStyle={{ margin: 0 }}
            type={"line"}
        >
            <Tabs.TabPane tab="动态" key="dynamic"></Tabs.TabPane>
            <Tabs.TabPane tab="投稿" key="upload"></Tabs.TabPane>
        </Tabs>
    );

    function handleOk() {
        const newFormData = editForm.getFieldsValue();
        // 判读是否有修改
        if (
            userInfo.username === newFormData.username &&
            userInfo.email === newFormData.email &&
            userInfo.profile.nickname === newFormData.nickname &&
            userInfo.profile.bio?.signature === newFormData.signature
        ) {
            setIsEdit(false);
            return;
        }
        setIsEditLoading(true);

        setIsEditLoading(false);
        setIsEdit(false);
        message.success("修改成功");
    }

    function handleCancel() {
        setIsEdit(false);
    }

    useEffect(() => {
        if (userInfo) {
            setFormData({
                phone: userInfo.phone,
                username: userInfo.username,
                email: userInfo.email,
                nickname: userInfo.profile.nickname,
                signature: userInfo.profile.bio?.signature,
            });
        }
    }, [userInfo]);

    if (!userInfo) {
        return <div>loading...</div>;
    }
    return (
        <>
            <CardContainer
                header={
                    <Button
                        onClick={() => navigate(-1)}
                        icon={<LeftOutlined />}
                    ></Button>
                }
            >
                <Flex
                    className={"w-full"}
                    gap={"1rem"}
                    justify={"start"}
                    align={"center"}
                >
                    {/* 头像 昵称 个性签名 */}
                    <Flex
                        className={"w-3/5"}
                        gap={"1rem"}
                        justify={"space-between"}
                    >
                        <Flex gap={"0.5rem"} className={"flex-1"}>
                            <Avatar
                                size={48}
                                src={userInfo.profile.avatar_url}
                                icon={<UserOutlined />}
                            ></Avatar>
                            <Flex vertical>
                                {/* 昵称 等级 */}
                                <Flex gap={"0.5rem"} align={"start"}>
                                    <div className={"text-xs font-bold"}>
                                        {userInfo.profile.nickname
                                            ? userInfo.profile.nickname
                                            : userInfo.username}
                                    </div>
                                    <Tag
                                        color={"gold-inverse"}
                                        bordered={false}
                                        style={{ fontSize: 10 }}
                                    >
                                        LV.{userInfo.level.level}
                                    </Tag>
                                </Flex>
                                {/* 个性签名 */}
                                <div className={"text-xs text-gray-500"}>
                                    {userInfo.profile.bio?.signature
                                        ? userInfo.profile.bio.signature
                                        : "什么都没写"}
                                </div>
                            </Flex>
                        </Flex>
                        {/*  修改资料按钮 */}

                        <Button
                            size={"small"}
                            className={"!text-xs !font-light"}
                            onClick={() => setIsEdit(true)}
                        >
                            修改资料
                        </Button>
                    </Flex>

                    {/*  等级进度  */}
                    <Flex
                        className={"w-2/5 border-l-[1px] border-gray-200"}
                        align={"center"}
                        vertical
                        gap={8}
                        style={{ padding: "1rem" }}
                    >
                        {/* 进度条容器 */}
                        <Flex
                            className="w-full"
                            justify="space-between"
                            align="center"
                        >
                            <span className="text-xs text-gray-500">
                                Lv.{userInfo.level.level}
                            </span>
                            <span className="text-xs text-gray-500">
                                下一等级: Lv.{userInfo.level.level + 1}
                            </span>
                        </Flex>

                        {/* 进度条 */}
                        <div className="h-2.5 w-full rounded-full bg-gray-100">
                            <div
                                className="h-2.5 rounded-full bg-blue-500"
                                style={{
                                    width: `${Math.min(100, (userInfo.level.ex / 100) * 100)}%`,
                                }}
                            ></div>
                        </div>

                        {/* 经验值显示 */}
                        <Flex className="w-full" justify="space-between">
                            <span className="text-xs text-gray-500">
                                {userInfo.level.ex} EXP
                            </span>
                            <span className="text-xs text-gray-500">
                                {getNextLevelEx(userInfo.level.level)} EXP
                            </span>
                        </Flex>
                    </Flex>
                </Flex>
                {/*粉丝、关注、收藏*/}
                <Flex className={"w-full"}>
                    <Flex
                        className={"w-1/3"}
                        justify={"center"}
                        align={"center"}
                        style={{ height: "100%" }}
                        vertical
                    >
                        <span className={"text-xl"}>0</span>
                        <span className={"text-xs text-gray-500"}>粉丝</span>
                    </Flex>
                    <Flex
                        className={"w-1/3"}
                        justify={"center"}
                        align={"center"}
                        style={{ height: "100%" }}
                        vertical
                    >
                        <span className={"text-xl"}>0</span>
                        <span className={"text-xs text-gray-500"}>关注</span>
                    </Flex>
                    <Flex
                        className={"w-1/3"}
                        justify={"center"}
                        align={"center"}
                        style={{ height: "100%" }}
                        vertical
                    >
                        <span className={"text-xl"}>0</span>
                        <span className={"text-xs text-gray-500"}>收藏</span>
                    </Flex>
                </Flex>
            </CardContainer>
            <Modal
                open={isEdit}
                onOk={handleOk}
                confirmLoading={isEditLoading}
                onCancel={handleCancel}
                cancelText={"取消"}
                okText={"保存"}
            >
                <Form
                    name="editForm"
                    form={editForm}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={formData}
                    variant={"filled"}
                >
                    <Form.Item
                        name="phone"
                        label="手机号"
                        rules={[{ message: "请输入手机号" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{ message: "请输入昵称" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ message: "请输入昵称" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ message: "请输入邮箱" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="signature"
                        label="个性签名"
                        rules={[{ message: "请输入个性签名" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <div className={"my-5 w-full"}></div>
            <CardContainer header={contentHeader}>
                <Outlet />
            </CardContainer>
        </>
    );
}
