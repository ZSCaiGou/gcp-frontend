import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/HomeMain/component/ContentCard";
import { useNavigation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getUserContentById } from "@/api/usercontent.api.ts";
import { Button, Card, Flex, Input, message } from "antd";
import { LikeFilled, LikeOutlined, StarOutlined } from "@ant-design/icons";

export default function HomeContentDetail() {
    const { contentId } = useParams<{ contentId: string }>();
    const [userContent, setUserContent] = useState<UserContent>(null);

    useEffect(() => {
        getUserContentById(contentId)
            .then((res) => {
                setUserContent(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);

    return (
        <>
            <Flex vertical className={"!relative"}>
                {userContent && (
                    <ContentCard
                        onClick={() => {}}
                        type={"detail"}
                        userContent={userContent}
                    />
                )}
                <Flex className={"fixed bottom-0 z-10 !w-[62%] bg-white"} align={ "center"} justify={"space-evenly"}>
                    <Input
                        variant={"filled"}
                        className={"!ml-2 !w-2/3"}
                        placeholder={"评论"}
                    ></Input>
                    <div className={"text-[2em]"}>
                        <LikeOutlined />
                    </div>
                    <div className={"text-[2em]"}>
                        <StarOutlined />
                    </div>
                </Flex>
                <Flex className={"!mt-4"}>
                    <Card className={"min-h-[300px] !w-full"}></Card>
                </Flex>
            </Flex>
        </>
    );
}
