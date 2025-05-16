import ContentCard from "@/pages/Home/component/ContentCard";
import { Card, Flex, message, Skeleton, Space } from "antd";
import { useEffect, useState, useCallback } from "react";
import {
    getMainUserContentList,
    getRandomUserContentList,
} from "@/api/usercontent.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { useLocation, useNavigate } from "react-router";
import { useCacheStore } from "@/stores/useCacheStore.tsx";

type MainPageState = {
    contentList: UserContent[];
    loading: boolean;
    hasMore: boolean;
};

export default function HomeMain() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getCache, setCache } = useCacheStore();
    const cacheKey = `{${location.pathname}`;
    const [pageState, setPageState] = useState<MainPageState>(
        () =>
            getCache(cacheKey) || {
                contentList: [],
                loading: false,
                hasMore: true,
            },
    );

    const loadMoreContent = useCallback(async () => {
        if (pageState.loading || !pageState.hasMore) return;

        setPageState((prev) => ({ ...prev, loading: true }));

        try {
            const res = await getRandomUserContentList(10);
            setPageState((prev) => ({
                ...prev,
                contentList: [...prev.contentList, ...res.data],
                loading: false,
                hasMore: res.data.length > 0,
            }));
        } catch (err) {
            message.error(err.message);
            setPageState((prev) => ({ ...prev, loading: false }));
            setPageState((prev) => ({ ...prev, hasMore: false }));
        }
    }, [pageState.loading, pageState.hasMore]);

    const handleScroll = useCallback(() => {
        const { scrollTop, clientHeight, scrollHeight } =
            document.documentElement;
        // 当滚动到接近底部时加载更多
        if (scrollHeight - (scrollTop + clientHeight) < 100) {
            loadMoreContent();
        }
    }, [loadMoreContent]);

    useEffect(() => {
        // 初始加载
        if (pageState.contentList.length === 0) {
            loadMoreContent();
        }

        // 添加滚动事件监听
        window.addEventListener("scroll", handleScroll);
        return () => {
            // 移除滚动事件监听
            window.removeEventListener("scroll", handleScroll);
            // 页面卸载时，缓存页面数据
            setCache(cacheKey, pageState, { ttl: 10 * 60 * 1000 });
        };
    }, [handleScroll]);

    const cardList = pageState.contentList?.map((item) => (
        <ContentCard
            onClick={() => {
                navigate(`/home/home-content-detail/${item.id}`);
            }}
            key={item.id}
            userContent={item}
        />
    ));

    return (
        <>
            <Flex gap={"middle"} align={"start"} vertical>
                {cardList}
                {pageState.loading && (
                    <>
                        <Card className="!w-full">
                            <Skeleton active />
                        </Card>
                        <Card className="!w-full">
                            <Skeleton active />
                        </Card>
                        <Card className="!w-full">
                            <Skeleton active />
                        </Card>
                    </>
                )}
            </Flex>
        </>
    );
}
