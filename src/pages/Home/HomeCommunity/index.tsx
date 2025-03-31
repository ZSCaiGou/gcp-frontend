import { Flex, Image, message } from "antd";
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";

import { useLocation, useNavigate } from "react-router";
import { ReactNode, useEffect, useState } from "react";
import { Game } from "@/Entity/game.entity.ts";
import {
    getGameCategoryList,
    getGameCommunityByCategory,
    getHotGameCommunityList,
    postGameCommunityByCategoryList,
} from "@/api/game.api.ts";
import { Category } from "@/Entity/category.entity.ts";

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

export default function HomeCommunity() {
    const cardList = [];
    const [hotGameCommunityList, setHotGameCommunityList] = useState<Game[]>();
    const [categoryList, setCategoryList] = useState<Category[]>();
    const [containerList, setContainerList] = useState<ReactNode[]>();
    useEffect(() => {
        // 获取热门社区游戏列表
        getHotGameCommunityList()
            .then((res) => {
                setHotGameCommunityList(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
        // 获取分类列表
        getGameCategoryList()
            .then((res) => {
                setCategoryList(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);
    useEffect(() => {
        if (categoryList?.length && categoryList.length > 0) {
            postGameCommunityByCategoryList(
                categoryList.map((category) => category.name),
            ).then((res) => {
                setContainerList(
                    res.data.map((categoryGameList) => (
                        <CardContainer
                            justify={"start"}
                            align={"top"}
                            key={Object.keys(categoryGameList)[0]}
                            header={Object.keys(categoryGameList)[0] + "游戏社区"}
                        >
                            {categoryGameList[
                                Object.keys(categoryGameList)[0]
                            ].map((game) => (
                                <GameCard
                                    key={game.id}
                                    src={game.game_img_url}
                                    title={game.title}
                                    id={game.id}
                                />
                            ))}
                        </CardContainer>
                    )),
                );
            });
        }
    }, [categoryList]);

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
                    {hotGameCommunityList?.map((game) => (
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
