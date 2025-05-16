import {
    Avatar,
    Button,
    Card,
    Carousel,
    Flex,
    Image,
    Input,
    message,
    Modal,
    Popover,
    Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { UserContent, UserContentType } from "@/Entity/user_content.entity.ts";
import Element = React.JSX.Element;
import {
    ArrowLeftOutlined,
    PlayCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import useUserStore from "@/stores/useUserStore.tsx";
import { deleteUserContent } from "@/api/usercontent.api.ts";
import { interactionApi } from "@/api/interaction.api";

export interface ContentCardProps {
    userContent: UserContent;
    onClick: (contentId: string) => void;
    type?: "detail" | "list";
    onDeleteContent?: (contentId: string) => void;
}

export default function ContentCard({
    userContent,
    onClick,
    type = "list",
    onDeleteContent = () => {},
}: ContentCardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [carouselContent, setCarouselContent] = useState<Element[]>();
    const loginUserInfo = useUserStore((state) => state.user);
    const [popVisible, setPopVisible] = useState(false);
    const [confirmState, setConfirmState] = useState({
        visible: false,
        loading: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (type === "detail") {
            setCarouselContent(
                userContent.picture_urls?.map((image) => (
                    <div key={image} className={"text-center"}>
                        <Image
                            key={image}
                            src={image}
                            preview={{
                                mask: <div></div>,
                            }}
                            className={"max-h-[24em] !w-full !rounded-md"}
                        ></Image>
                    </div>
                )),
            );
        }
        setIsLoading(false);
    }, []);
    // 复制链接
    const getContentLink = async () => {
        let link = window.location.origin;
        if (type === "detail") {
            link = window.location.href;
        } else if (type === "list") {
            link += "/home/home-content-detail/" + userContent.id;
        }
        await navigator.clipboard.writeText(link);
        message.success("链接已复制到剪贴板");
        setPopVisible(false);
    };

    // 删除内容
    function handleDeleteContent() {
        setConfirmState({ ...confirmState, loading: true });
        deleteUserContent(userContent.id as unknown as string)
            .then((res) => {
                setConfirmState({ visible: false, loading: false });
                onDeleteContent(userContent.id as unknown as string);
                message.success(res.message);
            })
            .catch((error) => {
                setConfirmState({ visible: false, loading: false });
                message.error(error.message);
            });
    }
    const handleFocusUser = async () => {
        if (!loginUserInfo?.id) {
            message.error("请先登录！");
            return;
        }
        if (userContent.user_info.id === loginUserInfo.id) {
            message.error("不能关注自己！");
            return;
        }
        // TODO: 关注用户
        try {
            const data = await interactionApi.focusUser(
                userContent.user_info.id,
            );
        } catch (error) {
            message.error(error.message);
        }
    };
    // 列表模式下操作按钮
    const listAciton = (
        <Flex vertical align={"center"} justify={"end"}>
            <Button
                className={"w-full !font-bold"}
                type={"text"}
                onClick={getContentLink}
            >
                复制链接
            </Button>
            {loginUserInfo?.id === userContent.user_info.id && (
                <>
                    <Button
                        className={"w-full !font-bold"}
                        type={"text"}
                        onClick={() => {
                            navigate(
                                "/home/home-content/edit/" + userContent.id,
                            );
                        }}
                    >
                        修改
                    </Button>
                    <Button
                        className={"w-full !font-bold"}
                        variant={"text"}
                        color={"danger"}
                        onClick={() => {
                            setConfirmState({ ...confirmState, visible: true });
                            setPopVisible(false);
                        }}
                    >
                        删除
                    </Button>
                </>
            )}
            {loginUserInfo?.id !== userContent.user_info.id && (
                <Button
                    className={"w-full !font-bold"}
                    variant={"text"}
                    color={"danger"}
                >
                    举报
                </Button>
            )}
        </Flex>
    );

    // 头像、昵称、等级
    const avatarBar = (
        <>
            <Flex justify={"start"} gap={".5em"} className={"!mt-4"}>
                <Avatar
                    size={type === "list" ? "small" : "default"}
                    src={userContent.user_info?.avatar_url}
                    className={"cursor-pointer"}
                />
                <Flex
                    className={"w-full cursor-pointer"}
                    align={"center"}
                    gap={".5em"}
                >
                    <div className={"text-xs font-bold"}>
                        {userContent.user_info.nickname}
                    </div>
                    <Tag
                        color={"gold-inverse"}
                        bordered={false}
                        style={{ fontSize: ".5em" }}
                        className={
                            "!flex !h-[2em] !w-[3em] !items-center !justify-center !p-0"
                        }
                    >
                        LV.{userContent.user_info?.level}
                    </Tag>
                </Flex>
                {type === "list" && (
                    <Popover
                        trigger={"click"}
                        placement={"bottomRight"}
                        content={listAciton}
                        open={popVisible}
                        onOpenChange={(visiable) => {
                            setPopVisible(visiable);
                        }}
                    >
                        <Button
                            className={"justify-self-end"}
                            variant={"filled"}
                            color={"default"}
                            type={"default"}
                            size={"small"}
                        >
                            ...
                        </Button>
                    </Popover>
                )}
                {type === "detail" && (
                    <Button
                        className={"justify-self-end"}
                        type={"primary"}
                        size={"small"}
                        icon={<PlusOutlined />}
                        onClick={handleFocusUser}
                    >
                        关注
                    </Button>
                )}
            </Flex>
        </>
    );

    // 社区标签列表
    const gameTagList = userContent.game_tags.map((tag) => {
        return (
            <Tag
                key={tag.id}
                rootClassName={"!flex !items-center !justify-center !h-[2em]"}
                className={"cursor-pointer"}
                onClick={() => navigate("/home/home-game/" + tag.id)}
            >
                <Flex gap={"0.5em"} align={"center"}>
                    <Image
                        width={"1.5em"}
                        height={"1.5em"}
                        preview={false}
                        src={tag.game_img_url}
                    />
                    {tag.title}
                </Flex>
            </Tag>
        );
    });

    // 话题标签列表
    const topicTagList = userContent.topic_tags.map((tag) => {
        return (
            <Tag
                key={tag.id}
                rootClassName={"!flex !items-center !justify-center !h-[2em]"}
            >
                <span className={"text-sky-400"}>#{tag.title}</span>
            </Tag>
        );
    });
    if (isLoading) {
        return <Card className={"!w-full"} loading={true}></Card>;
    }
    return (
        <>
            <Card
                className={
                    "!w-full" + (type === "detail" ? " !rounded-b-none" : "")
                }
                type={"inner"}
            >
                {type === "detail" && (
                    <Flex className={"!py-2"}>
                        <Button
                            type={"default"}
                            size={"small"}
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                        >
                            返回
                        </Button>
                    </Flex>
                )}
                {/* 轮播图、图片、标题、内容 */}
                <Flex vertical gap={".5em"} justify={"center"}>
                    <Flex justify={"center"}>
                        {carouselContent && type === "detail" && (
                            <Carousel
                                className={"!bg-gray-200"}
                                dots={true}
                                arrows
                                style={{ width: "58vw" }}
                                rootClassName={"!rounded-md"}
                            >
                                {carouselContent}
                            </Carousel>
                        )}
                    </Flex>

                    <Flex
                        justify={"center"}
                        className={"!max-h-[24em] !w-full px-8"}
                    >
                        {
                            // 详细模式下封面图
                            type === "detail" &&
                                (userContent.type === UserContentType.GUIDE ||
                                    userContent.type ===
                                        UserContentType.NEWS) && (
                                    <Image
                                        className={
                                            "!w-max-[18em] !h-full !rounded-md"
                                        }
                                        src={userContent.cover_url}
                                        preview={false}
                                    ></Image>
                                )
                        }
                    </Flex>
                    {/*list模式下头像、昵称、等级*/}
                    {avatarBar}
                    {/* 标题 */}
                    <div
                        onClick={() => {
                            onClick(userContent.id as unknown as string);
                        }}
                        className={
                            "cursor-pointer font-bold" +
                            (type === "list" ? "" : " text-lg")
                        }
                    >
                        {userContent.title}
                    </div>

                    {/* 内容 */}
                    <div
                        className={
                            type === "list"
                                ? "max-h-[8em] cursor-pointer overflow-hidden text-sm overflow-ellipsis"
                                : ""
                        }
                        dangerouslySetInnerHTML={{
                            __html: userContent.content,
                        }}
                        onClick={() => {
                            onClick(userContent.id as unknown as string);
                        }}
                    ></div>

                    {/* 标签 */}
                    <Flex justify={"start"} align={"center"} wrap={"wrap"}>
                        {gameTagList && gameTagList}
                        {topicTagList && topicTagList}
                    </Flex>
                </Flex>
            </Card>
            <Modal
                open={confirmState.visible}
                onCancel={() =>
                    setConfirmState({ ...confirmState, visible: false })
                }
                confirmLoading={confirmState.loading}
                onOk={handleDeleteContent}
                centered
                okText={"确认"}
                cancelText={"取消"}
                width={"15vw"}
                closable={false}
                footer={(_originNode, { OkBtn, CancelBtn }) => {
                    return (
                        <Flex justify={"center"} gap={"1em"}>
                            <CancelBtn></CancelBtn>
                            <OkBtn></OkBtn>
                        </Flex>
                    );
                }}
            >
                <Flex justify={"center"} align={"center"}>
                    <span className={"text-lg font-bold"}>确认删除</span>
                </Flex>
            </Modal>
        </>
    );
}
