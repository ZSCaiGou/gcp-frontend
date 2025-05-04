import { Button, Col, Flex, Image, Layout, Row } from "antd";
import { useEffect, useState } from "react";

import { GameCPLogo } from "@/component/Logo.tsx";
import { SearchBar } from "@/pages/Home/component/SearchBar";
import { AvatarBar } from "@/pages/Home/component/AvatarBar";
import { Outlet, useLocation } from "react-router";
import SiderBar from "@/pages/Home/component/SiderBar";
import UserActionBar from "@/pages/Home/component/UserActionBar";
import { useTheme } from "@/App.tsx";

const { Header, Content, Sider } = Layout;

export default function Home() {
    const isDark = useTheme((state) => state.isDark);
  
    return (
        <>
            <Layout className={"!m-0 !h-full !p-0"}>
                {/* 头部导航栏 */}
                <Header
                    className={isDark ? "!bg-black" : "!bg-white"}
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        height: "fit-content",
                    }}
                >
                    <Row
                        align="middle"
                        justify={"center"}
                        className={"!h-full"}
                    >
                        {/* 左侧logo */}
                        <Col
                            md={{ span: 4, order: 0 }}
                            xs={{ span: 12, order: 1 }}
                        >
                            <GameCPLogo></GameCPLogo>
                        </Col>
                        {/*中间搜索栏*/}
                        <Col
                            md={{ span: 10, order: 1 }}
                            xs={{ span: 24, order: 3 }}
                        >
                            <SearchBar></SearchBar>
                        </Col>
                        {/* 右侧头像栏 */}
                        <Col
                            md={{ span: 4, order: 2, offset: 6 }}
                            xs={{ span: 12, order: 2 }}
                            style={{ textAlign: "right" }}
                        >
                            <AvatarBar></AvatarBar>
                        </Col>
                    </Row>
                </Header>

                <Content className={"!h-full"} style={{ padding: "24px 36px" }}>
                    <Row gutter={[24, 24]}>
                        {/*左侧导航栏*/}
                        <Col xs={24} md={4}>
                            <SiderBar></SiderBar>
                        </Col>

                        <Col xs={24} md={16} className={"!m-0 !p-0"}>
                            {/*<GameCarousel />      /!* 游戏轮播推荐 *!/*/}
                            {/*<HotTopicsSection />  /!* 热门话题讨论 *!/*/}
                            {/*<ContentFeed />       /!* 动态内容流 *!/*/}
                            <Outlet />
                        </Col>

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
