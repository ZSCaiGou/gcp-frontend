import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore.tsx";
import { getUserDynamic } from "@/api/user.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { Flex, message, Empty, Card } from "antd";
import ContentCard from "@/pages/Home/component/ContentCard";
import { useNavigate, useOutletContext } from "react-router";

export default function Dynamic() {
    const navigate = useNavigate();
    const { userId } = useOutletContext<{ userId: string }>();
    const [personDynamicContentList, setPersonDynamicContentList] =
        useState<UserContent[]>();

    useEffect(() => {
        getUserDynamic(userId)
            .then((res) => {
                setPersonDynamicContentList(res.data);
            })
            .catch((error) => {
                message.error(error.message);
            });
    }, [userId]);
    // 删除动态内容
    const handleDeleteContent = (id: string) => {
        setPersonDynamicContentList(
            personDynamicContentList.filter(
                (item) => item.id.toString() !== id,
            ),
        );
    };
    // 动态内容列表
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
                {personDynamicContentList?.length ? (
                    cardList
                ) : (
                    <Card className="!w-full">
                        <Empty
                            description="暂无动态内容"
                            style={{ marginTop: 48 }}
                        />
                    </Card>
                )}
            </Flex>
        </>
    );
}
