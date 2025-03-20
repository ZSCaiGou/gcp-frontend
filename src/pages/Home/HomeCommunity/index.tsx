
import { Flex, Image } from "antd";
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import wukong from "@/assets/wukong.png";

// 游戏卡片组件
function GameCard({ src, title }) {
    return (
        <>
            <div
                className={
                    "mt-4 mb-4 flex h-[48px] w-[48px] cursor-pointer flex-col items-center justify-center rounded-full text-gray-600 duration-100 hover:text-gray-950"
                }
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
    for (let i = 0; i < 30; i++) {
        cardList.push(<GameCard src={wukong} title={"黑神话悟空"}></GameCard>);
    }
    return (
        <>
            <Flex gap={"middle"} align={"start"} vertical>
                {/*热门社区*/}
                <CardContainer title={"热门社区"}>{cardList}</CardContainer>
                {/*单机社区*/}
                <CardContainer title={"单机游戏社区"}>{cardList}</CardContainer>
                {/*联机社区*/}
                <CardContainer title={"联机游戏社区"}>{cardList}</CardContainer>
            </Flex>
        </>
    );
}
