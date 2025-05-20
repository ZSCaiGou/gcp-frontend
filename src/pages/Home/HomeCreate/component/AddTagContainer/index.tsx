// 添加标签组件
import { useEffect, useState } from "react";
import { Game } from "@/Entity/game.entity.ts";
import { Topic } from "@/Entity/topic.entity.ts";
import { Flex, Input, message, Image, Button, Modal } from "antd";
import { getGameTags } from "@/api/game.api.ts";
import { addTopic, getTopicTags } from "@/api/topic.api.ts";

export default function AddTagContainer({
    gameTags,
    setGameTags,
    topicTags,
    setTopicTags,
    addType,
    setAddModalVisible,
}:{
    gameTags: Game[];
    setGameTags: (tags: Game[]) => void;
    topicTags?: Topic[];
    setTopicTags?: (tags: Topic[]) => void;
    addType: string;
    setAddModalVisible: (visible: boolean) => void;
}) {
    const [searchKey, setSearchKey] = useState<string>("");
    const [defaultTags, setDefaultTags] = useState<(Game | Topic)[]>([]);
    const [filterTags, setFilterTags] = useState<(Game | Topic)[]>([]);
    const [addTagModalVisible, setAddTagModalVisible] = useState(false);
    const searchBar = (
        <Input
            variant={"filled"}
            placeholder={"搜索" + addType}
            onChange={(e) => {
                setSearchKey(e.target.value);
            }}
        ></Input>
    );
    // 添加自定义话题
    const handleAddTag = async () => {
        try {
            const res = await addTopic(searchKey);
            console.log(res);
            if (res.code === 200) {
                message.success("添加成功");
                setAddTagModalVisible(false);
                const tags = await getTopicTags();
                if (tags.code === 200){
                    setDefaultTags(tags.data)
                }
                setTopicTags([...topicTags, res.data]);
                setAddTagModalVisible(false)
                setAddModalVisible(false);
            }else{
                message.error(res.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };
    useEffect(() => {
        if (addType === "社区") {
            getGameTags()
                .then((res) => {
                    setDefaultTags(res.data);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } else if (addType === "话题") {
            getTopicTags()
                .then((res) => {
                    console.log(res);
                    setDefaultTags(res.data);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
    }, []);
    useEffect(() => {
        if (searchKey !== "") {
            console.log(searchKey);
            const filter = defaultTags.filter((tag) => {
                return tag.title.includes(searchKey);
            });
            setFilterTags(filter);
        } else {
            setFilterTags([...defaultTags]);
        }
    }, [searchKey, defaultTags]);
    if (addType === "社区") {
        const tagList = (filterTags as Game[]).map((tag) => {
            return (
                <Flex
                    key={tag.id}
                    align={"center"}
                    gap={"0.5em"}
                    className={
                        "h-[4em] w-full cursor-pointer rounded-md !p-4 hover:bg-gray-100"
                    }
                    onClick={() => {
                        const flag = gameTags.filter(
                            (item) => item.title === tag.title,
                        );
                        if (flag.length === 0) {
                            setGameTags([...gameTags, tag]);
                            setAddModalVisible(false);
                        } else {
                            message.info("已选择该社区");
                        }
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
                <Flex className={"!max-h-[300px] overflow-y-auto"} vertical>
                    {tagList}
                </Flex>
            </>
        );
    } else if (addType === "话题") {
        const tagList = (filterTags as Topic[]).map((tag) => {
            return (
                <Flex
                    key={tag.id}
                    align={"center"}
                    gap={"0.5em"}
                    className={
                        "h-[4em] w-full cursor-pointer rounded-md !p-4 hover:bg-gray-100"
                    }
                    onClick={() => {
                        const flag = topicTags.filter(
                            (item) => item.title === tag.title,
                        );
                        if (flag.length === 0) {
                            setTopicTags([...topicTags, tag]);
                            setAddModalVisible(false);
                        } else {
                            message.info("已选择该话题");
                        }
                    }}
                >
                    <Flex vertical>
                        <span className={"font-bold text-sky-500"}>
                            #{tag.title}
                        </span>
                        <div className={"text-xs font-thin"}>
                            <span>热度：{tag.hot_point}</span>
                            <span className={"ml-2"}>
                                参与人数：{tag.join_count}
                            </span>
                        </div>
                    </Flex>
                </Flex>
            );
        });
        return (
            <>
                <Flex gap={"middle"} justify="space-between">
                    {searchBar}{" "}
                    <Button
                        onClick={() => {
                            setAddTagModalVisible(true);
                        }}
                    >
                        添加话题
                    </Button>
                </Flex>
                <div className={"mt-4"}></div>
                <Flex className={"!max-h-[300px] overflow-y-auto"} vertical>
                    {tagList}
                </Flex>

                <Modal
                    title={"添加话题"}
                    open={addTagModalVisible}
                    onOk={handleAddTag}
                    onCancel={() => {
                        setAddTagModalVisible(false);
                    }}
                >
                    <Input
                        placeholder={"请输入话题名称"}
                        onChange={(e) => {
                            setSearchKey(e.target.value);
                        }}
                    />
                </Modal>
            </>
        );
    }
}
