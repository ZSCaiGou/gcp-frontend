import { useEffect, useState } from "react";
import { UserContent } from "@/Entity/user_content.entity.ts";
import { useNavigate, useOutletContext } from "react-router";
import { getUserUpload } from "@/api/user.api.ts";
import { Flex, message, Empty, Card } from "antd";
import ContentCard from "@/pages/Home/component/ContentCard";

export default function Upload() {
    const [uploadContentList, setUploadContentList] = useState<UserContent[]>();
    const navigate = useNavigate();
    const { userId } = useOutletContext<{ userId: string }>();
    
    useEffect(() => {
        getUserUpload(userId)
            .then((res) => {
                setUploadContentList(res.data);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, [userId]);

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
                {uploadContentList?.length ? cardList : (
                    <Card className="!w-full">
                        <Empty 
                        description="暂无上传内容"
                        style={{ marginTop: 48 }}
                    />
                    </Card>
                )}
            </Flex>
        </>
    );
}
