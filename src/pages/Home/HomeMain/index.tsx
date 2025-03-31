import ContentCard from "@/pages/Home/HomeMain/component/ContentCard";
import { Flex, message, Space } from "antd";
import { useEffect, useState } from "react";
import { getMainUserContentList } from "@/api/usercontent.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { useNavigate } from "react-router";

export default function HomeMain() {
    const [contentList, setContentList] = useState<UserContent[]>();
    const navigate = useNavigate();
    useEffect(() => {
        getMainUserContentList()
            .then((res) => {
                setContentList(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);
    const cardList = contentList?.map((item) => (
        <ContentCard  onClick={() => {
            navigate(`/home/home-content-detail/${item.id}`)
        }} key={item.id} userContent={item} />
    ));

    return (
        <>
            <Flex gap={"middle"} align={"start"} vertical>
                {cardList}
            </Flex>
        </>
    );
}
