import { useNavigate, useParams, useSearchParams } from "react-router";
import { Avatar, Card, message, Tabs } from "antd";
import { useEffect, useState } from "react";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/component/ContentCard";
import { Empty, Flex, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getSearch } from "@/api/search.api.ts";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(
        () => searchParams.get("search") || "",
    );

    const [activeTab, setActiveTab] = useState("community");
    const [loading, setLoading] = useState(false);
    const [communityResults, setCommunityResults] = useState<UserContent[]>([]);
    const [userResults, setUserResults] = useState<any[]>([]);
    const navigate = useNavigate();
    // TODO: 添加搜索API调用逻辑
    useEffect(() => {
        if (search) {
            setLoading(true);
            // 调用搜索API
            getSearch(search)
                .then((res) => {
                    setCommunityResults(res.data.content);
                    setUserResults(res.data.user);
                    setLoading(false);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
    }, [search]);
    useEffect(()=>{
        if(searchParams.get("search")){
            setSearch(searchParams.get("search"))
        }
    },[searchParams])
    const items = [
        {
            key: "community",
            label: "社区内容",
            children: loading ? (
                <Spin />
            ) : communityResults.length ? (
                <Flex vertical gap="middle">
                    {communityResults.map((item) => (
                        <ContentCard
                            onClick={() => {
                                navigate(
                                    `/home/home-content-detail/${item.id}`,
                                );
                            }}
                            key={`search-community-${item.id}`}
                            userContent={item}
                        />
                    ))}
                </Flex>
            ) : (
                <Card className={"!w-full"}>
                    <Empty description="暂无搜索结果" />
                </Card>
            ),
        },
        {
            key: "users",
            label: "用户",
            children: loading ? (
                <Spin />
            ) : userResults.length ? (
                <Flex vertical gap="middle">
                    {userResults.map((user) => (
                        <Card
                            key={`search-user-${user.id}`}
                            hoverable
                            style={{ width: "100%" }}
                            onClick={() =>
                                navigate(`/home/home-personal/${user.id}`)
                            }
                        >
                            <Flex align="center" gap="middle">
                                <Avatar
                                    size="large"
                                    src={user.avatar_url}
                                    icon={<UserOutlined />}
                                />
                                <Flex vertical>
                                    <span className="font-bold">
                                        {user.nickname || user.username}
                                    </span>
                                    {user.signature && (
                                        <span className="text-sm text-gray-500">
                                            {user.signature}
                                        </span>
                                    )}
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            ) : (
                <Card className={"!w-full"}>
                    <Empty description="暂无搜索结果" />
                </Card>
            ),
        },
    ];

    return (
        <div>
            <Tabs
                activeKey={activeTab}
                items={items}
                type={"card"}
                onChange={setActiveTab}
            />
        </div>
    );
}
