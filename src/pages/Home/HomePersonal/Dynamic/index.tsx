import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore.tsx";
import { getUserDynamic } from "@/api/user.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { Flex, message } from "antd";
import ContentCard from "@/pages/Home/component/ContentCard";
import { useNavigate } from "react-router";

export default function Dynamic() {
    const navigate = useNavigate();
    const userStore = useUserStore.getState();
    const [personDynamicContentList, setPersonDynamicContentList] =
        useState<UserContent[]>();
    useEffect(() => {
        getUserDynamic()
            .then((res) => {
                setPersonDynamicContentList(res.data);
            })
            .catch((error) => {
                message.error(error.message);
            });
    }, []);

    const handleDeleteContent = (id: string) => {
        setPersonDynamicContentList(
            personDynamicContentList.filter(
                (item) => item.id.toString() !== id,
            )
        );
    };

    const cardList = personDynamicContentList?.map((item) => (
        <ContentCard
            onClick={() => {
                navigate(`/home/home-content-detail/${item.id}`);
            }}
            key={"game-community-guide" + item.id}
            userContent={item}
            onDeleteContent={handleDeleteContent}
        />
    ));

    return (
        <>
            <Flex className={"!w-full"} gap={"middle"} align={"start"} vertical>
                {cardList}
            </Flex>
        </>
    );
}
