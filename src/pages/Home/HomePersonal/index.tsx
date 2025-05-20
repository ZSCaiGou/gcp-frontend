import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import { LeftOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Checkbox,
    Flex,
    Form,
    GetProp,
    Image,
    Input,
    message,
    Modal,
    Tabs,
    Tag,
    Upload,
    UploadFile,
    UploadProps,
} from "antd";
import { Outlet, useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";
import { useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import { updateUserAvatar, updateUserProfile } from "@/api/user.api.ts";
import { useParams } from "react-router";
import { getUserById } from "@/api/user.api.ts"; // 假设有这个API

// 表单值
export interface FormValue {
    phone: string;
    username: string;
    email: string;
    nickname: string;
    signature: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
// 获取文件base64
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
// 等级
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
    const { userId } = useParams<{ userId?: string }>();
    const navigate = useNavigate();

    // 当前登录用户信息
    const currentUserInfo = useUserStore((state) => state.user);
    // 显示的用户信息
    const [displayUserInfo, setDisplayUserInfo] = useState(currentUserInfo);
    const [isCurrentUser, setIsCurrentUser] = useState(true);

    // 获取用户信息
    useEffect(() => {
        console.log("userId", userId);
        if (userId) {
            if (userId === currentUserInfo?.id) {
                setDisplayUserInfo(currentUserInfo);
                setIsCurrentUser(true);
            } else {
                getUserById(userId)
                    .then((res) => {
                        setDisplayUserInfo(res.data);
                        setIsCurrentUser(false);
                    })
                    .catch((err) => {
                        message.error(err.message);
                        navigate(-1);
                    });
            }
        } else {
            setDisplayUserInfo(currentUserInfo);
            setIsCurrentUser(true);
        }
    }, [userId, currentUserInfo]);

    // 表单值初始化
    useEffect(() => {
        if (displayUserInfo) {
            setFormData({
                phone: displayUserInfo.phone,
                username: displayUserInfo.username,
                email: displayUserInfo.email,
                nickname: displayUserInfo.profile.nickname,
                signature: displayUserInfo.profile.bio?.signature,
            });
            setUploadAvatarUrl(displayUserInfo.profile.avatar_url);
        }
    }, [displayUserInfo]);

    const userInfo = useUserStore((state) => state.user);
    const [editForm] = Form.useForm();
    // 编辑状态
    const [isEdit, setIsEdit] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    // 头像上传
    const [uploadAvatarFile, setUploadAvatarFile] = useState<UploadFile>();
    const [uploadAvatarUrl, setUploadAvatarUrl] = useState<string>();
    // 表单值
    const [formData, setFormData] = useState<FormValue>();

    // 保存修改
    // 修改handleSaveProfile函数，只检查昵称和签名是否有变化
    function handleSaveProfile() {
        const newFormData = editForm.getFieldsValue();
        let isDataChanged = false;
        // 只检查昵称和签名是否有修改
        if (
            !(
                userInfo.profile.nickname === newFormData.nickname &&
                userInfo.profile.bio?.signature === newFormData.signature
            )
        ) {
            isDataChanged = true;
            setIsEditLoading(true);
            updateUserProfile(newFormData)
                .then((res) => {
                    message.success(res.message);
                    setIsEdit(false);
                    setIsEditLoading(false);
                    useUserStore
                        .getState()
                        .refreshUser()
                        .then(() => {});
                })
                .catch((error) => {
                    message.error(error.message);
                });
        }
        if (uploadAvatarFile) {
            isDataChanged = true;
            console.log(uploadAvatarFile);
            // 上传头像
            const avatarFormData = new FormData();

            avatarFormData.append(
                "avatar",
                uploadAvatarFile as unknown as File,
            );
            setIsEditLoading(true);
            updateUserAvatar(avatarFormData)
                .then((res) => {
                    message.success(res.message);
                    setIsEdit(false);
                    setIsEditLoading(false);
                    useUserStore
                        .getState()
                        .refreshUser()
                        .then(() => {});
                })
                .catch((error) => {
                    message.error(error.message);
                });
        }
        if (!isDataChanged) {
            setIsEdit(false);
            setIsEditLoading(false);
        }
    }

    // 表单值初始化
    useEffect(() => {
        if (userInfo) {
            setFormData({
                phone: userInfo.phone,
                username: userInfo.username,
                email: userInfo.email,
                nickname: userInfo.profile.nickname,
                signature: userInfo.profile.bio?.signature,
            });
            setUploadAvatarUrl(userInfo.profile.avatar_url);
        }
    }, [userInfo]);

    useEffect(() => {
        if (uploadAvatarFile) {
            getBase64(uploadAvatarFile as FileType)
                .then((url) => {
                    console.log(url);
                    setUploadAvatarUrl(url);
                })
                .catch((error) => {
                    message.error(error.message);
                });
        }
    }, [uploadAvatarFile]);

    // 头部标签
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
    // 判断是否有用户信息
    if (!userInfo) {
        return <div>loading...</div>;
    }

    return (
        <>
            {/*用户信息卡片*/}
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
                                src={displayUserInfo.profile.avatar_url}
                                icon={<UserOutlined />}
                            ></Avatar>
                            <Flex vertical>
                                {/* 昵称 等级 */}
                                <Flex gap={"0.5rem"} align={"start"}>
                                    <div className={"text-xs font-bold"}>
                                        {displayUserInfo.profile.nickname
                                            ? displayUserInfo.profile.nickname
                                            : displayUserInfo.username}
                                    </div>
                                    <Tag
                                        color={"gold-inverse"}
                                        bordered={false}
                                        style={{ fontSize: 10 }}
                                    >
                                        LV.{displayUserInfo.level.level}
                                    </Tag>
                                </Flex>
                                {/* 个性签名 */}
                                <div className={"text-xs text-gray-500"}>
                                    {displayUserInfo.profile.bio?.signature
                                        ? displayUserInfo.profile.bio.signature
                                        : "什么都没写"}
                                </div>
                            </Flex>
                        </Flex>
                        {/*  修改资料按钮,只有为当前用户时才显示 */}

                        {isCurrentUser && (
                            <Button
                                size={"small"}
                                className={"!text-xs !font-light"}
                                onClick={() => setIsEdit(true)}
                            >
                                修改资料
                            </Button>
                        )}
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
                            <span className="text-xs">
                                Lv.{displayUserInfo.level.level}
                            </span>
                            <span className="text-xs">
                                下一等级: Lv.{displayUserInfo.level.level + 1}
                            </span>
                        </Flex>

                        {/* 进度条 */}
                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                            <div
                                className="h-2.5 rounded-full bg-blue-500"
                                style={{
                                    width: `${Math.min(100, (displayUserInfo.level.ex / 100) * 100)}%`,
                                }}
                            ></div>
                        </div>

                        {/* 经验值显示 */}
                        <Flex className="w-full" justify="space-between">
                            <span className="text-xs">
                                {displayUserInfo.level.ex} EXP
                            </span>
                            <span className="text-xs">
                                {getNextLevelEx(displayUserInfo.level.level)}{" "}
                                EXP
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
                        <span className={"text-xl"}>
                            {currentUserInfo.fans_count}
                        </span>
                        <span className={"text-xs"}>粉丝</span>
                    </Flex>
                    <Flex
                        className={"w-1/3"}
                        justify={"center"}
                        align={"center"}
                        style={{ height: "100%" }}
                        vertical
                    >
                        <span className={"text-xl"}>
                            {currentUserInfo.follow_count}
                        </span>
                        <span className={"text-xs"}>关注</span>
                    </Flex>
                    <Flex
                        className={"w-1/3"}
                        justify={"center"}
                        align={"center"}
                        style={{ height: "100%" }}
                        vertical
                    >
                        <span className={"text-xl"}>
                            {currentUserInfo.collect_count}
                        </span>
                        <span className={"text-xs text-gray-500"}>收藏</span>
                    </Flex>
                </Flex>
            </CardContainer>
            {/* 修改资料弹窗 */}
            <Modal
                open={isEdit}
                onOk={handleSaveProfile}
                confirmLoading={isEditLoading}
                onCancel={() => {
                    setIsEdit(false);
                    setUploadAvatarFile(undefined);
                    setUploadAvatarUrl(userInfo.profile.avatar_url);
                    editForm.resetFields();
                }}
                cancelText={"取消"}
                okText={"保存"}
                footer={(_, { OkBtn, CancelBtn }) => {
                    return (
                        <Flex justify={"center"} gap={"1rem"}>
                            <CancelBtn />
                            <OkBtn />
                        </Flex>
                    );
                }}
                destroyOnClose={true}
            >
                <Flex justify={"center"} className={"!mb-4"}>
                    <ImgCrop
                        zoomSlider
                        showReset
                        resetText={"重置"}
                        cropShape={"round"}
                        minZoom={1}
                        quality={0.8}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            beforeUpload={(file: UploadFile) => {
                                setUploadAvatarFile(file);
                                return false;
                            }}
                            showUploadList={false}
                            onChange={(info) => {
                                console.log(info);
                            }}
                        >
                            <Image
                                width={100}
                                height={100}
                                className={"rounded-full"}
                                src={uploadAvatarUrl}
                                preview={false}
                            ></Image>
                        </Upload>
                    </ImgCrop>
                </Flex>
                <Form
                    name="editForm"
                    form={editForm}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={formData}
                    variant={"filled"}
                >
                    <Form.Item name="phone" label="手机号">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="username" label="用户名">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="email" label="邮箱">
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
                        name="signature"
                        label="个性签名"
                        rules={[{ message: "请输入个性签名" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>

            <div className={"my-5 w-full"}></div>
            {/* 内容卡片 */}
            <CardContainer header={contentHeader}>
                <></>
            </CardContainer>
            <Outlet context={{ userId: userId || currentUserInfo?.id }} />
        </>
    );
}
