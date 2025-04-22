import { useEffect, useState } from "react";
import { getGameCommunityPostContentList } from "@/api/game.api.ts";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/component/ContentCard";
import { Flex } from "antd";
import { useCacheStore } from "@/stores/useCacheStore.tsx";
type CommunityPageState = {
    postContentList: UserContent[];
}

export default function Community() {
    const { gameId } = useOutletContext<{ gameId: string }>();
    const [postContentList, setPostContentList] = useState<UserContent[]>();
    const {getCache,setCache  } = useCacheStore();
    const location = useLocation();
    const cacheKey = location.pathname;
    // #todo: 缓存
    const [pageState, setPageState] = useState(()=> getCache(cacheKey) || {
        postContentList:[]
    });

    const navigate = useNavigate();
    useEffect(() => {
        getGameCommunityPostContentList(gameId).then((res) => {
            setPostContentList(res.data);
        });
    }, []);
    const cardList = postContentList?.map((item) => (
        <ContentCard
            onClick={() => {
                navigate(`/home/home-content-detail/${item.id}`);
            }}
            key={"game-community-post"+item.id}
            userContent={item}

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
