import { Card, Select, Space } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { ModeratorCommunity } from "@/api/moderator.api";
import { useState } from "react";

const { Option } = Select;

interface AnalyticsProps {
    managedCommunities: ModeratorCommunity[];
}

const Analytics = ({ managedCommunities }: AnalyticsProps) => {
    const [selectedCommunity, setSelectedCommunity] = useState("1");

    const handleCommunityChange = (value: string) => {
        setSelectedCommunity(value);
        // 这里可以加载对应社区的数据
    };

    return (
        <div>
            <div className="mb-4">
                <Select
                    value={selectedCommunity}
                    onChange={handleCommunityChange}
                    style={{ width: 180 }}
                    suffixIcon={<SwapOutlined />}
                >
                    {managedCommunities?.map((community) => (
                        <Option key={community.id} value={community.id}>
                            {community.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-4">
                <Card>
                    <h3 className="text-gray-500">今日发帖</h3>
                    <p className="text-2xl font-bold">124</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500">今日活跃用户</h3>
                    <p className="text-2xl font-bold">356</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500">待审核内容</h3>
                    <p className="text-2xl font-bold">23</p>
                </Card>
            </div>
            <Card title="近7日活跃度">
                <div className="flex h-64 items-center justify-center bg-gray-100">
                    活跃度图表
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
