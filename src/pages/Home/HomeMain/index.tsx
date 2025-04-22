import ContentCard from "@/pages/Home/component/ContentCard";
import { Flex, message, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { getMainUserContentList } from "@/api/usercontent.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { useLocation, useNavigate } from "react-router";
import { useCacheStore } from "@/stores/useCacheStore.tsx";

type MainPageState = {
    contentList: UserContent[];
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
            },
    );

    useEffect(() => {
        // 缓存中没有数据，请求数据
        if (pageState.contentList.length === 0) {
            getMainUserContentList()
                .then((res) => {
                    console.log(res.data);
                    setPageState((state) => ({
                        ...state,
                        contentList: res.data,
                    }));
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
        return () => {};
    }, []);
    useEffect(() => {
        return () => {
            // 页面卸载时，缓存页面数据
            setCache(cacheKey, pageState, { ttl: 10 * 60 * 1000 });
        };
    }, [pageState, cacheKey]);

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
            </Flex>
        </>
    );
}
