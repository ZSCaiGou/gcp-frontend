import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import { Button, Flex, Tabs } from "antd";
import { Outlet, useNavigate } from "react-router";
import { LeftOutlined } from "@ant-design/icons";

export default function HomeCreate() {
    const navigate = useNavigate();
    const contentHeader = (
        <Flex gap={"middle"} justify={"start"} align={"center"}>
            <Button
                onClick={() => navigate(-1)}
                icon={<LeftOutlined />}
            ></Button>
            <Tabs
                onChange={(key) => navigate(key, { replace: true })}
                tabBarStyle={{ margin: 0 }}
                type={"line"}
            >
                <Tabs.TabPane tab="发布动态" key="post-dynamic"></Tabs.TabPane>
                <Tabs.TabPane tab="发布稿件" key="post-upload"></Tabs.TabPane>
                <Tabs.TabPane tab="发布资讯" key="post-news"></Tabs.TabPane>
            </Tabs>
        </Flex>
    );
    return (
        <>
            <CardContainer header={contentHeader}>
                <Outlet />
            </CardContainer>
        </>
    );
}
