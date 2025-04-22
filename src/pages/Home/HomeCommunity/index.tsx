import { Flex, Image, message } from "antd";
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";

import { useLocation, useNavigate } from "react-router";
import { ReactNode, useEffect, useState } from "react";
import { Game } from "@/Entity/game.entity.ts";
import {
    getAllCategoryGameList,
    getHotGameCommunityList,
} from "@/api/game.api.ts";
import { Category } from "@/Entity/category.entity.ts";
import { useCacheStore } from "@/stores/useCacheStore.tsx";
import { CategoryGameList } from "@/interface/game.ts";

interface GameCardProps {
    src: string;
    title: string;
    id: bigint;
}

// 游戏卡片组件
function GameCard({ src, title, id }: GameCardProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
        console.log(location);
        navigate({ pathname: "/home/home-game/" + id });
    };

    return (
        <>
            <div
                className={
                    "mt-4 mb-4 flex h-[48px] w-[48px] cursor-pointer flex-col items-center justify-center rounded-full text-gray-600 duration-100 hover:text-gray-950"
                }
                onClick={handleClick}
            >
                <Image preview={false} width={36} height={36} src={src}></Image>
                <div className={"text-center text-xs font-bold text-wrap"}>
                    {title}
                </div>
            </div>
        </>
    );
}

type HomeCommunityPageState = {
    hotGameCommunityList: Game[];
    categoryGameList: CategoryGameList[];
};
export default function HomeCommunity() {
    const location = useLocation();
    const cacheKey = location.pathname;
    const { setCache, getCache } = useCacheStore();

    const [pageState, setPageState] = useState<HomeCommunityPageState>(
        () =>
            getCache(cacheKey) || {
                hotGameCommunityList: [],
                categoryGameList: [],
            },
    );

    useEffect(() => {
        if (
            pageState.hotGameCommunityList.length === 0 ||
            pageState.categoryGameList.length === 0
        ) {
            // 获取热门社区游戏列表
            getHotGameCommunityList()
                .then((res) => {
                    setPageState((prev) => ({
                        ...prev,
                        hotGameCommunityList: res.data,
                    }));
                })
                .catch((err) => {
                    message.error(err.message);
                });
            getAllCategoryGameList()
                .then((res) => {
                    setPageState((prev) => ({
                        ...prev,
                        categoryGameList: res.data,
                    }));
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
    }, []);
    useEffect(() => {
        return () => {
            setCache(cacheKey, pageState, { ttl: 10 * 60 * 1000 });
        };
    }, [pageState, cacheKey]);
    const containerList = pageState.categoryGameList.map((item:CategoryGameList) => {
        const key = Object.keys(item)[0]
        console.log(item[key]);
        if(item[key].gameList && item[key].gameList.length > 0 ) {
            return (
                <CardContainer
                    justify={"start"}
                    align={"top"}
                    key={key}
                    header={key + "游戏社区"}
                >
                    {item[key]?.gameList?.map((game) => (
                        <GameCard
                            key={game.id}
                            src={game.game_img_url}
                            title={game.title}
                            id={game.id}
                        />
                    ))}
                </CardContainer>
            )
        }
    });

    return (
        <>
            <Flex gap={"middle"} align={"start"} vertical>
                {/*热门社区*/}
                <CardContainer
                    justify={"start"}
                    align={"top"}
                    key={"hot"}
                    header={"热门社区"}
                >
                    {pageState.hotGameCommunityList?.map((game) => (
                        <GameCard
                            key={game.id}
                            src={game.game_img_url}
                            title={game.title}
                            id={game.id}
                        />
                    ))}
                </CardContainer>
                {containerList}
            </Flex>
        </>
    );
}
