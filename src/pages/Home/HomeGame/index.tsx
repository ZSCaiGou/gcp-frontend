import { Button, Flex, message, Tabs } from "antd";
import { Outlet, useNavigate, useParams } from "react-router";
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getGameById } from "@/api/game.api.ts";
import { Game } from "@/Entity/game.entity.ts";

export default function HomeGame() {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();
    const [gameInfo, setGameInfo] = useState<Game>();
    useEffect(() => {
        getGameById(gameId)
            .then((res) => {
                setGameInfo(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);
    const header = (
        <>
            <Flex gap={"middle"} justify={"start"} align={"center"}>
                <Button
                    onClick={() => navigate(-1)}
                    icon={<LeftOutlined />}
                ></Button>
                <Tabs
                    onChange={(key) => navigate(key, { replace: true })}
                    tabBarStyle={{ margin: 0 }}
                    type={"line"}
                >
                    <Tabs.TabPane tab="社区" key="community"></Tabs.TabPane>
                    <Tabs.TabPane tab="攻略" key="guide"></Tabs.TabPane>
                    <Tabs.TabPane tab="资讯" key="news"></Tabs.TabPane>
                    <Tabs.TabPane tab="下载" key="download"></Tabs.TabPane>
                </Tabs>
            </Flex>
        </>
    );
    return (
        <>
            <CardContainer header={header}>
                <></>
            </CardContainer>
            <Outlet context={{ gameId }}></Outlet>
        </>
    );
}
