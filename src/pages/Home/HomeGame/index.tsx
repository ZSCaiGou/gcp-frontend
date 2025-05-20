import { Button, Col, Flex, Image, message, Row, Tabs, TabsProps } from "antd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getGameById } from "@/api/game.api.ts";
import { Game } from "@/Entity/game.entity.ts";
import { useCacheStore } from "@/stores/useCacheStore.tsx";
import Community from "./Community";
import Guide from "./Guide";
import News from "./News";
import Download from "./Download";
import UploadResourceModal from "@/component/UploadResource";

type HomeGamePageState = {
    gameInfo: Game;
};

export default function HomeGame() {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();
    const { getCache, setCache } = useCacheStore();
    const cacheKey = "/home/home-game/" + gameId;
    const [pageState, setPageState] = useState<HomeGamePageState>(
        () =>
            getCache(cacheKey) || {
                gameInfo: null,
            },
    );
    const [activeTab, setActiveTab] = useState("community");
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        // 当cacheKey状态发生变化时，更新缓存
        setPageState(() => getCache(cacheKey) || { gameInfo: null });
    }, [cacheKey]);

    useEffect(() => {
        // 获取缓存后，页面状态为空，重新获取游戏信息
        if (pageState.gameInfo === null) {
            getGameById(gameId)
                .then((res) => {
                    setPageState({
                        gameInfo: res.data,
                    });
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
        return () => {
            // 页面卸载时，更新缓存
            setCache(cacheKey, pageState, { ttl: 10 * 60 * 1000 });
        };
    }, [pageState]);
    const tabsItems: TabsProps["items"] = [
        {
            key: "community",
            label: "社区",
            children: <Community gameId={gameId} />,
        },
        {
            key: "guide",
            label: "攻略",
            children: <Guide gameId={gameId} />,
        },
        {
            key: "news",
            label: "资讯",
            children: <News gameId={gameId} />,
        },
        {
            key: "download",
            label: "下载",
            children: <Download gameId={gameId} />,
        },
    ];

    return (
        <>
            <CardContainer
                header={
                    <Button
                        onClick={() => navigate(-1)}
                        icon={<LeftOutlined />}
                    >
                        返回
                    </Button>
                }
            >
                <Row
                    justify={"center"}
                    align={"middle"}
                    gutter={{ xs: 8, sm: 8, md: 16, lg: 24 }}
                    className={"!w-full"}
                >
                    {/*游戏图片*/}
                    <Col md={{ span: 4 }}>
                        <Image
                            preview={false}
                            className={"!h-[8em] !w-[8em]"}
                            src={pageState.gameInfo?.game_img_url}
                        ></Image>
                    </Col>
                    {/*游戏信息*/}
                    <Col md={{ span: 16 }}>
                        <Flex vertical={true}>
                            <span className={"text-lg font-bold"}>
                                {pageState.gameInfo?.title}
                            </span>
                            <span>{pageState.gameInfo?.description}</span>
                        </Flex>
                    </Col>
                    {/*操作栏*/}
                    <Col md={{ span: 4 }}></Col>
                </Row>
            </CardContainer>
            <CardContainer header={<></>}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    tabBarStyle={{ margin: 0 }}
                    items={tabsItems}
                    type={"line"}
                    rootClassName="!w-full"
                    tabBarExtraContent={
                        <Flex gap={"10px"}>
                            <Button
                                type="link"
                                size={"small"}
                                onClick={() =>
                                    navigate(
                                        `/home/home-create/post-dynamic?gameId=${gameId}`,
                                    )
                                }
                            >
                                发布新帖
                            </Button>
                            <Button
                                type="default"
                                size={"small"}
                                onClick={() => setVisible(true)}
                            >
                                上传资源
                            </Button>
                        </Flex>
                    }
                />
            </CardContainer>
            {pageState.gameInfo && (
                <UploadResourceModal
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    onOk={() => {
                        setVisible(false);
                    }}
                    game={pageState.gameInfo}
                />
            )}
        </>
    );
}
