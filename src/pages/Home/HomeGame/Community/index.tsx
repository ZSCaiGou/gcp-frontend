import { useEffect, useState } from "react";
import { getGameCommunityPostContentList } from "@/api/game.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/component/ContentCard";
import { Flex, Button, Input } from "antd";
import { useCacheStore } from "@/stores/useCacheStore.tsx";
import { useNavigate } from "react-router";

type CommunityPageState = {
    postContentList: UserContent[];
    loading: boolean;
    searchText: string;
};

interface CommunityProps {
    gameId: string;
}

export default function Community({ gameId }: CommunityProps) {
    const { getCache, setCache } = useCacheStore();
    const cacheKey = `/home/home-game/${gameId}/community`;
    
    const [pageState, setPageState] = useState<CommunityPageState>(() => 
        getCache(cacheKey) || {
            postContentList: [],
            loading: true,
            searchText: ""
        }
    );

    const navigate = useNavigate();
    
    useEffect(() => {
        setPageState(prev => ({...prev, loading: true}));
        getGameCommunityPostContentList(gameId)
            .then((res) => {
                setPageState(prev => ({
                    ...prev,
                    postContentList: res.data,
                    loading: false
                }));
            })
            .catch(() => {
                setPageState(prev => ({...prev, loading: false}));
            });
    }, [gameId]);

    useEffect(() => {
        return () => {
            setCache(cacheKey, pageState, { ttl: 10 * 60 * 1000 });
        };
    }, [pageState, cacheKey]);

    const filteredContent = pageState.postContentList.filter(item =>
        item.title.toLowerCase().includes(pageState.searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(pageState.searchText.toLowerCase())
    );

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Input.Search 
                    placeholder="搜索帖子内容"
                    value={pageState.searchText}
                    onChange={(e) => setPageState(prev => ({
                        ...prev,
                        searchText: e.target.value
                    }))}
                    style={{ width: 300 }}
                />
                <Button 
                    type="primary" 
                    onClick={() => navigate(`/home/home-create/post-dynamic?gameId=${gameId}`)}
                >
                    发布新帖
                </Button>
            </Flex>
            
            <Flex gap="middle" align="start" vertical>
                {pageState.postContentList
                    .filter(item =>
                        item.title.toLowerCase().includes(pageState.searchText.toLowerCase()) ||
                        item.content.toLowerCase().includes(pageState.searchText.toLowerCase())
                    )
                    .map((item) => (
                        <ContentCard
                            onClick={() => navigate(`/home/home-content-detail/${item.id}`)}
                            key={"game-community-post"+item.id}
                            userContent={item}
                        />
                    ))}
            </Flex>
        </Flex>
    );
}
