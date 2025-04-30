import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider, DatePicker, Space, Typography, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TeamOutlined, MessageOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { communityApi } from '@/api/community';
import dayjs from 'dayjs';
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
    community:AdminCommunity    ; // 假设社区对象包含基本信息
}

const CommunityStats = ({ community }: Props) => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(30, 'days'),
        dayjs(),
    ]);

    // 加载统计数据
    const fetchStats = async () => {
        try {
            setLoading(true);
            const params = {
                startDate: dateRange[0].format('YYYY-MM-DD'),
                endDate: dateRange[1].format('YYYY-MM-DD'),
            };
            const data = await communityApi.getCommunityStats(community.id,  params);
            setStats(data);
        } catch (error) {
            console.error(' 获取统计数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [community.id, dateRange]);

    const handleDateChange = (dates) => {
        if (dates && dates.length  === 2) {
            setDateRange(dates);
        }
    };

    const lineConfig = {
        data: stats?.memberActivity || [],
        xField: 'date',
        yField: 'count',
        seriesField: 'type',
        height: 300,
        smooth: true,
        legend: { position: 'top' },
        xAxis: { type: 'time' },
        tooltip: {
            formatter: (data) => ({
                name: data.type  === 'members' ? '新增成员' : '新增帖子',
                value: data.count,
            }),
        },
    };

    const pieConfig = {
        data: stats?.memberDistribution || [],
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider',
            content: '{name}\n{percentage}',
        },
        height: 300,
    };

    if (!stats) {
        return <Spin tip="加载统计数据..." />;
    }

    return (
        <div className="community-stats">
            <div className="stats-header" style={{ marginBottom: 16 }}>
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                        disabledDate={(current) => current > dayjs()}
                    />
                    <Title level={5}>{community.title}  - 社区统计</Title>
                </Space>
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总成员数"
                            value={stats.memberCount}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总帖子数"
                            value={stats.postCount}
                            prefix={<MessageOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="日活跃用户"
                            value={stats.dailyActiveUsers}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="周增长率"
                            value={stats.weeklyGrowthRate}
                            precision={2}
                            valueStyle={{
                                color: stats.weeklyGrowthRate  >= 0 ? '#3f8600' : '#cf1322',
                            }}
                            prefix={
                                stats.weeklyGrowthRate  >= 0 ? (
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
            <Card loading={loading}>
                <Line {...lineConfig} data={stats.memberActivity}  />
            </Card>

            <Divider orientation="left">帖子增长趋势</Divider>
            <Card loading={loading}>
                <Line {...lineConfig} data={stats.postActivity}  />
            </Card>

            <Divider orientation="left">成员分布</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Card loading={loading}>
                        <Pie {...pieConfig} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card loading={loading}>
                        <Statistic
                            title="版主数量"
                            value={stats.moderatorCount}
                            prefix={<TeamOutlined />}
                        />
                        <Divider type="horizontal" />
                        <Statistic
                            title="评论总数"
                            value={stats.commentCount}
                            prefix={<MessageOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CommunityStats;