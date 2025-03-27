import { Button, Flex, Tabs } from "antd";
import { Outlet, useNavigate } from "react-router";
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import { LeftOutlined } from "@ant-design/icons";

export default function HomeGame() {
    const navigate = useNavigate();
    const header = (
        <>
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
                    <Tabs.TabPane tab="社区" key="community"></Tabs.TabPane>
                    <Tabs.TabPane tab="攻略" key="guide"></Tabs.TabPane>
                    <Tabs.TabPane tab="资讯" key="news"></Tabs.TabPane>
                    <Tabs.TabPane tab="下载" key="download"></Tabs.TabPane>
                </Tabs>
            </Flex>
        </>
    );
    return (
        <>
            <CardContainer header={header}>
                <Outlet></Outlet>
            </CardContainer>
        </>
    );
}
