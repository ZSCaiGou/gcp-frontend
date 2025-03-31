import { useEffect, useState } from "react";
import { getGameCommunityGuideContentList } from "@/api/game.api.ts";
import { useNavigate, useOutletContext } from "react-router";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/HomeMain/component/ContentCard";
import { Flex } from "antd";

export default function Guide() {
    const { gameId } = useOutletContext<{ gameId: string }>();
    const [guideContentList, setGuideContentList] = useState<UserContent[]>();
    const navigate = useNavigate();
    useEffect(() => {
        getGameCommunityGuideContentList(gameId).then((res)=>{
            setGuideContentList(res.data)
        });
    }, []);
    const cardList = guideContentList?.map((item) => (
        <ContentCard
            onClick={() => {
                navigate(`/home/home-content-detail/${item.id}`);
            }}
            key={"game-community-guide" + item.id}
            userContent={item}

        />
    ));

    return (
        <>
            <Flex className={"!w-full"} gap={"middle"} align={"start"} vertical>
                {cardList}
            </Flex>
        </>
    );
}
