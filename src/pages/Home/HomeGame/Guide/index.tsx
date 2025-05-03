import { useEffect, useState } from "react";
import { getGameCommunityGuideContentList } from "@/api/game.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/component/ContentCard";
import { Empty, Flex, message, Spin } from "antd";
import { useNavigate } from "react-router";

interface GuideProps {
    gameId: string;
}

export default function Guide({ gameId }: GuideProps) {
    const [guideContentList, setGuideContentList] = useState<UserContent[]>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getGameCommunityGuideContentList(gameId)
            .then((res) => {
                setGuideContentList(res.data);
                setLoading(false);
            })
            .catch((err) => {
                message.error('加载攻略失败');
                setLoading(false);
            });
    }, [gameId]);

    if (loading) return <Spin />;
    if (!guideContentList?.length) return <Empty description="暂无攻略" />;

    const cardList = guideContentList?.map((item) => (
        <ContentCard
            onClick={() => navigate(`/home/home-content-detail/${item.id}`)}
            key={"game-community-guide" + item.id}
            userContent={item}
        />
    ));

    return (
        <Flex className="!w-full" gap="middle" align="start" vertical>
            {cardList}
        </Flex>
    );
}
