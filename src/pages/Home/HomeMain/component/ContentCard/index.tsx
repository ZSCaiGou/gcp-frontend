import { Avatar, Button, Card, Carousel, Flex, Image, Input, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { UserContent, UserContentType } from "@/Entity/user_content.entity.ts";
import Element = React.JSX.Element;
import {
    ArrowLeftOutlined,
    PlayCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

export interface ContentCardProps {
    userContent: UserContent;
    onClick: (contentId: string) => void;
    type?: "detail" | "list";
}

export default function ContentCard({
    userContent,
    onClick,
    type = "list",
}: ContentCardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [carouselContent, setCarouselContent] = useState<Element[]>();
    const navigate = useNavigate();

    useEffect(() => {
        setCarouselContent(
            userContent.picture_urls?.map((image) => (
                <div className={"text-center"}>
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
        if (ContentCard.length > 0) {
            setIsLoading(false);
        }
    }, []);

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
                    <Button
                        className={"justify-self-end"}
                        variant={"filled"}
                        color={"default"}
                        type={"default"}
                        size={"small"}
                    >
                        ...
                    </Button>
                )}
                {type === "detail" && (
                    <Button
                        className={"justify-self-end"}
                        type={"primary"}
                        size={"small"}
                        icon={<PlusOutlined />}
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
    return (
        <>
            <Card
                className={
                    "!w-full" + (type === "detail" ? " !rounded-b-none" : "")
                }
                loading={isLoading}
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
                            // 列表模式下
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
                                ? "max-h-[8em] cursor-pointer overflow-clip text-sm"
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
                    <Flex justify={"start"} align={"center"}>
                        {gameTagList && gameTagList}
                        {topicTagList && topicTagList}
                    </Flex>
                </Flex>
            </Card>
        </>
    );
}
