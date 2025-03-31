// 快速入口
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import ImgCard from "@/component/CardShowComponent/ImgCard.tsx";
import wukong from "@/assets/wukong.png";
import cs from "@/assets/cs.png";
import {
    DatabaseOutlined,
    FolderOpenOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Flex, message } from "antd";
import { useEffect, useState } from "react";
import { getHotGameCommunityList } from "@/api/game.api.ts";
import { Game } from "@/Entity/game.entity.ts";

function FastForward() {
    const cardList = [];

    cardList.push(
        <ImgCard
            navigateTo={"/home/home-personal"}
            key={"gr"}
            size={32}
            title={"个人中心"}
        >
            <UserOutlined style={{ fontSize: 24, color: "orange" }} />
        </ImgCard>,
        <ImgCard key={"zy"} size={32} title={"资源库"}>
            <DatabaseOutlined style={{ fontSize: 24, color: "skyblue" }} />
        </ImgCard>,
        <ImgCard key={"sc"} size={32} title={"上传资源"}>
            <FolderOpenOutlined style={{ fontSize: 24, color: "green" }} />
        </ImgCard>,
    );

    return (
        <>
            <CardContainer header={"快速入口"} justify={"space-evenly"}>
                {" "}
                {cardList}{" "}
            </CardContainer>
        </>
    );
}

function HotGameCommunity() {
    const [hotGameCommunityList, setHotGameCommunityList] = useState<Game[]>();
    useEffect(() => {
        getHotGameCommunityList()
            .then((res) => {
                setHotGameCommunityList(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);

    return (
        <>
            <CardContainer header={"热门社区"} justify={"space-evenly"}>
                {hotGameCommunityList &&
                    hotGameCommunityList.map((game) => (
                        <ImgCard
                            navigateTo={`/home/home-game/${game.id}`}
                            key={game.id}
                            title={game.title}
                            src={game.game_img_url}
                        />
                    ))}
            </CardContainer>
        </>
    );
}

export default function UserActionBar() {
    return (
        <>
            <Flex vertical gap={"middle"}>
                <FastForward />
                <HotGameCommunity />
            </Flex>
        </>
    );
}
