
import { useEffect, useState } from "react";
// import { getGameDownloadInfo } from "@/api/game.api.ts";
import { useNavigate, useOutletContext } from "react-router";
import { Flex, Button, Space } from "antd";
interface DownloadProps {
    gameId: string;
}
export default function Download( { gameId }: DownloadProps) {

    const [downloadInfo, setDownloadInfo] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
        // getGameDownloadInfo(gameId)
        //     .then((res) => setDownloadInfo(res.data))
        //     .catch((err) => console.error(err));
    }, [gameId]);

    return (
        <Flex vertical gap="middle">
            <Space>
                <Button type="primary" onClick={() => window.open(downloadInfo?.officialUrl)}>
                    官方下载
                </Button>
                <Button onClick={() => window.open(downloadInfo?.patchUrl)}>
                    补丁下载
                </Button>
            </Space>
        </Flex>
    );
}