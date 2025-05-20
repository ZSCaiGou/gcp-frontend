import { useEffect, useState } from "react";
// import { getGameDownloadInfo } from "@/api/game.api.ts";
import { Flex, Button, Space, List, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { getResources } from "@/api/resource.api.ts";

interface DownloadProps {
    gameId: string;
}

interface DownloadItem {
    id: string;
    name: string;
    version: string;
    size: string;
    url: string;
    type: "official" | "patch" | "mod";
}

export default function Download({ gameId }: DownloadProps) {
    const [downloadList, setDownloadList] = useState<DownloadItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getResources(gameId)
            .then((res) => {
                setDownloadList(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [gameId]);

    return (
        <Flex vertical gap="middle">
            {/*提示*/}
            <Typography.Text className={"!mt-4"} type="secondary">
                提示：所有文件都来自于网络，为了你的电脑安全，请不要随意运行下载文件中的.exe、.bat等可执行文件。
            </Typography.Text>
            <List
                loading={loading}
                dataSource={downloadList}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => window.open(item.url)}
                            >
                                下载
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={`${item.name} (${item.version})`}
                            description={
                                <>
                                    <Typography.Text type="secondary">
                                        大小: {item.size} MB
                                    </Typography.Text>
                                    <br />
                                    <Typography.Text type="secondary">
                                        类型:{" "}
                                        {item.type === "official"
                                            ? "官方"
                                            : item.type === "patch"
                                              ? "补丁"
                                              : "模组"}
                                    </Typography.Text>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </Flex>
    );
}
