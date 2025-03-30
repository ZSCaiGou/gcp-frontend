import { Button, Flex, Input, message, Modal, Image, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MyEditor from "@/component/MyEditor";
import { UserContentType } from "@/Entity/user_content.entity.ts";
import { useEffect, useState } from "react";
import { Game } from "@/Entity/game.entity.ts";

import { getGameTags } from "@/api/game.api.ts";
import { Topic } from "@/Entity/topic.entity.ts";
import {
    saveNewsContent,
    saveNewsContentAsDraft,
} from "@/api/usercontent.api.ts";

export default function PostNews() {
    const [contentValue, setContentValue] = useState<string>();
    const [contentTitle, setContentTitle] = useState<string>();

    const [contentType, setContentType] = useState<UserContentType>(
        UserContentType.NEWS,
    );

    const [isSaveLoading, setIsSaveLoading] = useState(false);

    // 标签相关
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addType, setAddType] = useState("社区");
    const [gameTag, setGameTag] = useState<Game>(undefined);

    const handlePostUploadContent = (type: "draft" | "publish") => {
        const data = {
            title: contentTitle,
            content: contentValue,
            type: contentType,
            game_ids: [gameTag.id],
        };
        if (type === "draft") {
            saveNewsContentAsDraft(data)
                .then((res) => {
                    message.success("保存成功");
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } else if (type === "publish") {
            setIsSaveLoading(true);
            saveNewsContent(data)
                .then((res) => {
                    message.success("发布成功");
                    setIsSaveLoading(false);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
    };

    // 添加标签组件
    function AddTagContainer() {
        const [searchKey, setSearchKey] = useState<string>();
        const [defaultTags, setDefaultTags] = useState<Game[] | Topic[]>([]);

        const searchBar = (
            <Input variant={"filled"} placeholder={"搜索" + addType}></Input>
        );

        useEffect(() => {
            getGameTags()
                .then((res) => {
                    setDefaultTags(res.data);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }, []);

        const tagList = (defaultTags as Game[]).map((tag) => {
            return (
                <Flex
                    align={"center"}
                    gap={"0.5em"}
                    className={
                        "h-[4em] w-full cursor-pointer rounded-md !p-4 hover:bg-gray-100"
                    }
                    onClick={() => {
                        setGameTag(tag);
                        setAddModalVisible(false);
                    }}
                >
                    <Image
                        width={"3em"}
                        height={"3em"}
                        src={tag.game_img_url}
                        preview={false}
                    />
                    <Flex vertical>
                        <span>{tag.title}</span>
                        <span className={"text-xs font-thin"}>
                            热度：{tag.hot_point}
                        </span>
                    </Flex>
                </Flex>
            );
        });

        return (
            <>
                <Flex>{searchBar}</Flex>
                <div className={"mt-4"}></div>
                <Flex vertical>{tagList}</Flex>
            </>
        );
    }

    useEffect(() => {});

    const gameTagContainer = gameTag && (
        <Tag
            key={gameTag.id}
            closable
            rootClassName={"!flex !items-center !justify-center !h-[3em]"}
            onClose={() => {
                setGameTag(undefined);
            }}
        >
            <Flex gap={"0.5em"} align={"center"}>
                <Image
                    width={"2em"}
                    height={"2em"}
                    preview={false}
                    src={gameTag.game_img_url}
                />
                {gameTag.title}
            </Flex>
        </Tag>
    );

    return (
        <>
            <Flex vertical gap={"1em"} className={"w-full p-2"}>
                {/*编辑器*/}
                <Flex gap={"0"} vertical className={"w-full"}>
                    {/*标题输入框*/}
                    <Input
                        variant={"filled"}
                        className={"w-full !rounded-b-none !bg-gray-50"}
                        placeholder="输入标题..."
                        onChange={(e) => setContentTitle(e.target.value)}
                    />
                    {/*内容编辑器*/}
                    <MyEditor
                        html={contentValue}
                        setHtml={setContentValue}
                    ></MyEditor>
                </Flex>
                {/*添加社区按钮*/}
                <Flex gap={"1em"} align={"center"}>
                    <Flex gap={"0"} vertical>
                        <span className={"font-bold"}>关联社区</span>
                        <span className={"text-xs"}>
                            {(gameTag ? 1 : 0) + "/1"}{" "}
                        </span>
                    </Flex>
                    <Flex>
                        {gameTagContainer}
                        {gameTag ? null : (
                            <Button
                                className={"!h-[2.5em] !font-thin"}
                                size={"small"}
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setAddModalVisible(true);
                                    setAddType("社区");
                                }}
                            >
                                添加社区
                            </Button>
                        )}
                    </Flex>
                </Flex>
                {/* 保存和存草稿按钮*/}
                <Flex gap={"1em"} align={"center"} justify={"end"}>
                    <Button
                        className={"!font-thin"}
                        size={"middle"}
                        type={"default"}
                        onClick={() => {}}
                    >
                        存草稿
                    </Button>
                    <Button
                        className={"!font-thin"}
                        size={"middle"}
                        type={"primary"}
                        loading={isSaveLoading}
                        onClick={() => {
                            handlePostUploadContent("publish");
                        }}
                    >
                        发布
                    </Button>
                </Flex>
            </Flex>

            <Modal
                open={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                title={"添加游戏"}
                footer={() => (
                    <Button
                        className={"w-full"}
                        type={"primary"}
                        onClick={() => setAddModalVisible(false)}
                    >
                        取消
                    </Button>
                )}
                destroyOnClose={true}
            >
                <AddTagContainer />
            </Modal>
        </>
    );
}
