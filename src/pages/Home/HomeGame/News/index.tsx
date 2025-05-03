import { useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { getGameCommunityNewsContentList } from "@/api/game.api.ts";
import { UserContent } from "@/Entity/user_content.entity.ts";
import ContentCard from "@/pages/Home/component/ContentCard";
import { Empty, Flex, Input, message, Pagination, Spin } from "antd";

interface NewsProps {
    gameId: string;
}

export default function News({ gameId }: NewsProps) {
    const [newsContentList, setNewsContentList] = useState<UserContent[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchNewsContent();
    }, [gameId, pagination.current, searchText]);

    const fetchNewsContent = async () => {
        try {
            setLoading(true);
            const res = await getGameCommunityNewsContentList(
                gameId, 
                pagination.current,
                pagination.pageSize,
                searchText
            );
            setNewsContentList(res.data.items);
            setPagination(prev => ({
                ...prev,
                total: res.data.total
            }));
        } catch (error) {
            message.error('加载资讯失败');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({
            ...prev,
            current: page
        }));
    };

    if (loading) return <Spin />;
    if (!newsContentList.length) return <Empty description="暂无资讯" />;

    return (
        <Flex vertical gap="middle">
            <Input.Search
                placeholder="搜索资讯"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
            />
            
            <Flex gap="middle" align="start" vertical>
                {newsContentList.map((item) => (
                    <ContentCard
                        onClick={() => navigate(`/home/home-content-detail/${item.id}`)}
                        key={"game-community-news"+item.id}
                        userContent={item}
                        type="list"
                    />
                ))}
            </Flex>

            <Flex justify="center">
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </Flex>
        </Flex>
    );
}
