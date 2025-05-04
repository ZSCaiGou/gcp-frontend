import { useEffect, useRef, useState } from "react";

import { Game } from "@/Entity/game.entity.ts";
import { Topic } from "@/Entity/topic.entity.ts";
import {
    Button,
    Flex,
    Image,
    Input,
    message,
    Modal,
    Popover,
    Select,
    Tag,
    Upload,
    UploadFile,
    UploadProps,
} from "antd";
import { UserContentType } from "@/Entity/user_content.entity.ts";
import {
    saveUploadContent,
    saveUploadContentAsDraft,
} from "@/api/usercontent.api.ts";

import { PlusOutlined, SmileOutlined } from "@ant-design/icons";
import MyEditor from "@/component/MyEditor";
import AddTagContainer from "@/pages/Home/HomeCreate/component/AddTagContainer";

export default function PostUpload() {
    const [contentValue, setContentValue] = useState<string>();
    const [contentTitle, setContentTitle] = useState<string>();

    const [contentType, setContentType] = useState<UserContentType>(
        UserContentType.GUIDE,
    );

    const [isSaveLoading, setIsSaveLoading] = useState(false);
    // 标签相关
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addType, setAddType] = useState("社区");
    const [gameTags, setGameTags] = useState<Game[]>([]);
    const [topicTags, setTopicTags] = useState<Topic[]>([]);
    // 图片相关
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState<string>();
    const [previewOpen, setPreviewOpen] = useState(false);
    // 图片更改
    const handleChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
    };
    // 图片预览
    const handlePreview = (file: UploadFile) => {
        setPreviewImage(file.response.data || file.thumbUrl);
        setPreviewOpen(true);
    };
    // 上传按钮
    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
        </button>
    );
    // 发布和存草稿
    const handlePostUploadContent = (type: "draft" | "publish") => {
        const data = {
            title: contentTitle,
            content: contentValue,
            type: UserContentType.GUIDE,
            game_ids: gameTags.map((game) => game.id),
            topic_ids: topicTags.map((topic) => topic.id),
            cover_url: fileList[0].response.data,
        };
        if (type === "draft") {
            saveUploadContentAsDraft(data)
                .then((res) => {
                    message.success("保存成功");
                })
                .catch((err) => {
                    message.error(err.message);
                });
        } else if (type === "publish") {
            setIsSaveLoading(true);
            saveUploadContent(data)
                .then((res) => {
                    message.success("发布成功");
                    setIsSaveLoading(false);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
    };

    useEffect(() => {});
    const gameTagList = gameTags.map((tag) => {
        return (
            <Tag
                key={tag.id}
                closable
                rootClassName={"!flex !items-center !justify-center !h-[3em]"}
                onClose={() => {
                    setGameTags(gameTags.filter((item) => item.id !== tag.id));
                }}
            >
                <Flex gap={"0.5em"} align={"center"}>
                    <Image
                        width={"2em"}
                        height={"2em"}
                        preview={false}
                        src={tag.game_img_url}
                    />
                    {tag.title}
                </Flex>
            </Tag>
        );
    });
    const topicTagList = topicTags.map((tag) => {
        return (
            <Tag
                key={tag.id}
                closable
                rootClassName={"!flex !items-center !justify-center !h-[3em]"}
                onClose={() => {
                    setTopicTags(
                        topicTags.filter((item) => item.id !== tag.id),
                    );
                }}
            >
                <span className={"text-sky-400"}>#{tag.title}</span>
            </Tag>
        );
    });
    return (
        <>
            <Flex vertical gap={"1em"} className={"w-full p-2"}>
                <Flex align={"center"}>
                    <Button variant={"text"} type={"text"} color={"default"}>
                        封面：
                    </Button>
                    <Upload
                        name={"cover"}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        action={"/api/user-content/cover"}
                        headers={{
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        }}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: "none" }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) =>
                                    setPreviewOpen(visible),
                                afterOpenChange: (visible) =>
                                    !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                        />
                    )}
                </Flex>

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
                            {gameTags.length + "/1"}{" "}
                        </span>
                    </Flex>
                    <Flex>
                        {gameTagList}
                        {gameTags.length >= 1 ? null : (
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
                {/*添加话题按钮*/}
                <Flex gap={"1em"} align={"center"} justify={"start"}>
                    <Flex gap={"0"} vertical>
                        <span className={"font-bold"}>关联话题</span>
                        <span className={"text-xs"}>
                            {topicTags.length + "/5"}
                        </span>
                    </Flex>
                    <Flex>
                        {topicTagList}
                        {topicTags.length >= 5 ? null : (
                            <Button
                                className={"!h-[2.5em] !font-thin"}
                                size={"small"}
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setAddModalVisible(true);
                                    setAddType("话题");
                                }}
                            >
                                添加话题
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
                title={"添加" + addType}
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
                <AddTagContainer
                    addType={addType}
                    gameTags={gameTags}
                    setGameTags={setGameTags}
                    topicTags={topicTags}
                    setTopicTags={setTopicTags}
                    setAddModalVisible={setAddModalVisible}
                />
            </Modal>
        </>
    );
}
