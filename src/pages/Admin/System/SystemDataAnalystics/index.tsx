import { Row, Col, Card } from "antd";
import * as echarts from "echarts";
import { useEffect } from "react";

const SystemDataAnalytics = () => {
    useEffect(() => {
        // 用户增长趋势图
        const userChart = echarts.init(
            document.getElementById("user-growth-chart"),
        );
        userChart.setOption({
            tooltip: {},
            xAxis: {
                type: "category",
                data: ["12月", "1月", "2月", "3月", "4月", "5月"],
            },
            yAxis: { type: "value" },
            series: [{ type: "line", data: [0, 0, 0, 0, 8, 0] }],
        });

        // 社区分布图
        const communityChart = echarts.init(
            document.getElementById("community-distribution-chart"),
        );
        communityChart.setOption({
            series: [
                {
                    type: "pie",
                    data: [
                        { value: 2, name: "黑神话：悟空" },
                        { value: 1, name: "三角洲行动" },
                        { value: 2, name: "CS2" },
                        { value: 1, name: "赛博朋克：2077" },
                        {value:3, name:"其他"}
                    ],
                },
            ],
        });

        // 内容类型占比图
        const contentTypeChart = echarts.init(
            document.getElementById("content-type-chart"),
        );
        contentTypeChart.setOption({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '内容类型',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: '帖子' },
                        { value: 735, name: '评论' },
                        { value: 580, name: '分享' },
                        { value: 484, name: '收藏' },
                        { value: 300, name: '点赞' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });

        // 活跃度趋势图
        const activityChart = echarts.init(
            document.getElementById("activity-trend-chart"),
        );
        activityChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '活跃用户',
                    type: 'bar',
                    data: [2, 3, 1, 0, 2, 4, 5],
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            ]
        });

        return () => {
            userChart.dispose();
            communityChart.dispose();
            contentTypeChart.dispose();
            activityChart.dispose();
        };
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <Card title="用户增长趋势">
                        <div id="user-growth-chart" style={{ height: 250 }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="社区内容占比">
                        <div
                            id="community-distribution-chart"
                            style={{ height: 250 }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="内容类型占比">
                        <div id="content-type-chart" style={{ height: 250 }} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="活跃度趋势">
                        <div
                            id="activity-trend-chart"
                            style={{ height: 250 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SystemDataAnalytics;
