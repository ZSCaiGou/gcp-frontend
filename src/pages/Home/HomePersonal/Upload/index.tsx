import { useEffect, useState } from "react";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { useNavigate } from "react-router";
import { getUserUpload } from "@/api/user.api.ts";
import { Flex, message } from "antd";
import ContentCard from "@/pages/Home/HomeMain/component/ContentCard";

export default function Upload() {
    const [uploadContentList, setUploadContentList] = useState<UserContent[]>();
    const navigate = useNavigate();
    useEffect(() => {
        getUserUpload()
            .then((res) => {
                setUploadContentList(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);

    const cardList = uploadContentList?.map((item) => (
        <ContentCard
            onClick={() => {
                navigate(`/home/home-content-detail/${item.id}`);
            }}
            key={"game-community-guide" + item.id}
            userContent={item}
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
