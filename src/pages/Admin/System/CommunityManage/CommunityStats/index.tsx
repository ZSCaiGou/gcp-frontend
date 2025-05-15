import { useState, useEffect, useRef } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Divider,
    DatePicker,
    Space,
    Typography,
    Spin,
} from "antd";
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    TeamOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";
import { communityApi } from "@/api/community";
import dayjs from "dayjs";
import { AdminCommunity } from "@/api/community.ts";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface StatsData {
    memberCount: number;
    moderatorCount: number;
    postCount: number;
    commentCount: number;
    dailyActiveUsers: number;
    weeklyGrowthRate: number;
    memberActivity: Array<{ date: string; count: number }>;
    postActivity: Array<{ date: string; count: number }>;
    memberDistribution: Array<{ type: string; value: number }>;
}

interface Props {
    community: AdminCommunity; // 假设社区对象包含基本信息
}

const CommunityStats = ({ community }: Props) => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(30, "days"),
        dayjs(),
    ]);

    // 加载统计数据
    const fetchStats = async () => {
        try {
            setLoading(true);
            const params = {
                startDate: dateRange[0].format("YYYY-MM-DD"),
                endDate: dateRange[1].format("YYYY-MM-DD"),
            };
            // 模拟数据
            const mockData: StatsData = {
                memberCount: 0,
                moderatorCount: 2,
                postCount: 1,
                commentCount: 5,
                dailyActiveUsers: 0,
                weeklyGrowthRate: 0,
                memberActivity: Array.from({ length: 30 }, (_, i) => ({
                    date: dayjs()
                        .subtract(30 - i, "days")
                        .format("YYYY-MM-DD"),
                    count: 0,
                })),
                postActivity: Array.from({ length: 30 }, (_, i) => ({
                    date: dayjs()
                        .subtract(30 - i, "days")
                        .format("YYYY-MM-DD"),
                    count: i=== 28 ? 1 : 0,
                })),
                memberDistribution: [
                    { type: "普通用户", value: 0 },
                    { type: "活跃用户", value: 0 },
                    { type: "版主", value: 2 },
                ],
            };
            setStats(mockData);
            // 实际API调用注释掉
            // const data = await communityApi.getCommunityStats(community.id, params);
            // setStats(data);
        } catch (error) {
            console.error("获取统计数据失败:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [community.id, dateRange]);

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        }
    };

    // if (!stats) {
    //     return <Spin tip="加载统计数据..." />;
    // }

    const memberChartRef = useRef<HTMLDivElement>(null);
    const postChartRef = useRef<HTMLDivElement>(null);
    const pieChartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!stats) return;

        // 初始化图表
        const memberChart = echarts.init(memberChartRef.current);
        const postChart = echarts.init(postChartRef.current);
        const pieChart = echarts.init(pieChartRef.current);

        // 成员增长趋势配置
        memberChart.setOption({
            tooltip: {
                trigger: "axis",
                formatter: (params: any) => {
                    return `${params[0].axisValue}<br/>新增成员: ${params[0].value}`;
                },
            },
            xAxis: {
                type: "category",
                data: stats.memberActivity.map((item) => item.date),
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: stats.memberActivity.map((item) => item.count),
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        color: "#1890ff",
                    },
                },
            ],
        });

        // 帖子增长趋势配置
        postChart.setOption({
            tooltip: {
                trigger: "axis",
                formatter: (params: any) => {
                    return `${params[0].axisValue}<br/>新增帖子: ${params[0].value}`;
                },
            },
            xAxis: {
                type: "category",
                data: stats.postActivity.map((item) => item.date),
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                    data: stats.postActivity.map((item) => item.count),
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        color: "#52c41a",
                    },
                },
            ],
        });

        // 成员分布饼图配置
        pieChart.setOption({
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            legend: {
                orient: "vertical",
                left: "left",
            },
            series: [
                {
                    name: "成员分布",
                    type: "pie",
                    radius: "50%",
                    data: stats.memberDistribution.map((item) => ({
                        value: item.value,
                        name: item.type,
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        });

        return () => {
            memberChart.dispose();
            postChart.dispose();
            pieChart.dispose();
        };
    }, [stats]);

    return (
        <div className="community-stats">
            <div className="stats-header" style={{ marginBottom: 16 }}>
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                        disabledDate={(current) => current > dayjs()}
                    />
                    <Title level={5}>{community.title} - 社区统计</Title>
                </Space>
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总成员数"
                            value={stats?.memberCount}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总帖子数"
                            value={stats?.postCount}
                            prefix={<MessageOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="日活跃用户"
                            value={stats?.dailyActiveUsers}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="周增长率"
                            value={stats?.weeklyGrowthRate}
                            precision={2}
                            valueStyle={{
                                color:
                                    stats?.weeklyGrowthRate >= 0
                                        ? "#3f8600"
                                        : "#cf1322",
                            }}
                            prefix={
                                stats?.weeklyGrowthRate >= 0 ? (
                                    <ArrowUpOutlined />
                                ) : (
                                    <ArrowDownOutlined />
                                )
                            }
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">成员增长趋势</Divider>
            <Card >
                <div ref={memberChartRef} style={{ height: 300 }} />
            </Card>

            <Divider orientation="left">帖子增长趋势</Divider>
            <Card >
                <div ref={postChartRef} style={{ height: 300 }} />
            </Card>

            <Divider orientation="left">成员分布</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Card >
                        <div ref={pieChartRef} style={{ height: 300 }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card loading={loading}>
                        <Statistic
                            title="版主数量"
                            value={stats?.moderatorCount}
                            prefix={<TeamOutlined />}
                        />
                        <Divider type="horizontal" />
                        <Statistic
                            title="评论总数"
                            value={stats?.commentCount}
                            prefix={<MessageOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CommunityStats;
