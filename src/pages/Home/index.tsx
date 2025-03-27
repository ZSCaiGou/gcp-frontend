import { Button, Col, Flex, Image, Layout, Row } from "antd";
import { useState } from "react";

import { GameCPLogo } from "@/component/Logo.tsx";
import { SearchBar } from "@/pages/Home/component/SearchBar";
import { AvatarBar } from "@/pages/Home/component/AvatarBar";
import { Outlet } from "react-router";
import SiderBar from "@/pages/Home/component/SiderBar";
import UserActionBar from "@/pages/Home/component/UserActionBar";

const { Header, Content, Sider } = Layout;

const handleClick = () => {};

export default function Home() {
    const [loginMoal, setLoginMoal] = useState<boolean>(false);

    return (
        <>
            <Layout className={"!h-full"}>
                {/* 头部导航栏 */}
                <Header
                    className={"!bg-white"}
                    style={{ position: "sticky", top: 0, zIndex: 1000 }}
                >
                    <Row align="middle" justify={"center"} className={"!h-full"}>
                        {/* 左侧logo */}
                        <Col span={4}>
                            <Flex justify={"center"} align={"center"}>
                                <GameCPLogo></GameCPLogo>
                            </Flex>
                        </Col>
                        {/*中间搜索栏*/}
                        <Col span={16}>
                            <Flex className={"w-2/3"} justify={"center"} align={"center"}>
                                <SearchBar></SearchBar>
                            </Flex>
                        </Col>
                        {/* 右侧头像栏 */}
                        <Col span={4} style={{ textAlign: "right" }}>
                            <AvatarBar></AvatarBar>
                        </Col>
                    </Row>
                </Header>

                <Content className={"!h-full"}  style={{ padding: "24px 50px" }}>
                    <Row gutter={[24, 24]}>
                        {/*左侧导航栏*/}
                        <Col xs={24} md={4}>
                            <SiderBar></SiderBar>
                        </Col>
                        {/* 中间主内容区（占16栅格） */}
                        <Col  xs={24} md={16}>
                            {/*<GameCarousel />      /!* 游戏轮播推荐 *!/*/}
                            {/*<HotTopicsSection />  /!* 热门话题讨论 *!/*/}
                            {/*<ContentFeed />       /!* 动态内容流 *!/*/}
                            <Outlet/>
                        </Col>

                        {/* 右侧边栏区（占8栅格） */}
                        <Col xs={0} md={4}>
                            {/*<QuickAccessPanel />  /!* 快捷入口面板 *!/*/}
                            {/*<RankingList />       /!* 游戏热度排行榜 *!/*/}
                            {/*<EventCalendar />     /!* 活动日历 *!/*/}
                            <UserActionBar></UserActionBar>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </>
    );
}
