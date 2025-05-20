import { Card, Select, Space } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { ModeratorCommunity } from "@/api/moderator.api";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import axios, { AxiosResponse } from "axios";
import { Result } from "@/interface/common.ts";

const { Option } = Select;

interface AnalyticsProps {
    managedCommunities: ModeratorCommunity[];
}

const Analytics = ({ managedCommunities }: AnalyticsProps) => {
    const [selectedCommunity, setSelectedCommunity] = useState<string>();
    const [todayCount, setTodayCount] = useState(0);
    const [uncheckCount, setUncheckCount] = useState(0);
    const handleCommunityChange = (value: string) => {
        setSelectedCommunity(value);
        // 这里可以加载对应社区的数据
    };
    useEffect(() => {
        if (managedCommunities?.length > 0) {
            setSelectedCommunity(managedCommunities[0].id);
        } else {
            setSelectedCommunity(undefined);
        }
    }, [managedCommunities]);
    useEffect(() => {
        if (selectedCommunity) {
            handleRenderChart(selectedCommunity);
        }
    }, [selectedCommunity]);
    const handleRenderChart = async (id) => {
        const response: AxiosResponse<
            Result<{
                dates: string[];
                data: string[];
                todayCount: number;
                uncheckCount: number;
            }>
        > = await axios.get("/data-analysis/community/" + id);
        const { data } = response.data;
        setTodayCount(data.todayCount);
        setUncheckCount(data.uncheckCount);
        const chart = echarts.init(document.getElementById("post-trend-chart"));
        const option = {
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: ["发帖量"],
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: data.dates,
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    name: "发帖量",
                    type: "line",
                    data: data.data,
                },
            ],
        };
        chart.setOption(option);
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
            <div className="mb-6 grid grid-cols-2 gap-4">
                <Card>
                    <h3 className="text-gray-500">今日发帖</h3>
                    <p className="text-2xl font-bold">{todayCount}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500">待审核内容</h3>
                    <p className="text-2xl font-bold">{uncheckCount}</p>
                </Card>
            </div>
            <Card title="近7日发帖量">
                <div id="post-trend-chart" style={{ height: 250 }}></div>
            </Card>
        </div>
    );
};

export default Analytics;
