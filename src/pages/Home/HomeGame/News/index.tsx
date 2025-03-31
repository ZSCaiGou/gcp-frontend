import { useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { getGameCommunityNewsContentList } from "@/api/game.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/HomeMain/component/ContentCard";
import { Flex } from "antd";

export default function News() {
    const { gameId } = useOutletContext<{ gameId: string }>();
    const [newsContentList, setNewsContentList] = useState<UserContent[]>();
    const navigate = useNavigate();
    useEffect(() => {
        getGameCommunityNewsContentList(gameId).then((res) => {
            setNewsContentList(res.data)
        });
    }, []);
    const cardList = newsContentList?.map((item) => (
        <ContentCard
            onClick={() => {
                navigate(`/home/home-content-detail/${item.id}`);
            }}
            key={ "game-community-news" + item.id}
            userContent={ item}
            type={"list"}
        />
    ));

    return (
        <>
            <Flex gap={"middle"} align={"start"} vertical>
                {cardList}
            </Flex>
        </>
    );
}
