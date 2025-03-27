import ContentCard from "@/pages/Home/HomeMain/component/ContentCard";
import { Flex, Space } from "antd";
import { useEffect } from "react";

export default function HomeMain() {
    //TODO:从后端获取数据
    useEffect(() => {}, []);

    const cardList = [];
    for (let i = 0; i < 30; i++) {
        cardList.push(<ContentCard key={i}></ContentCard>);
    }

    return (
        <>
            <Flex gap={"middle"} align={"start"} vertical>
                {cardList}
            </Flex>
        </>
    );
}
