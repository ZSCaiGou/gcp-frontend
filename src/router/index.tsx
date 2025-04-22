import {
    createBrowserRouter,
    createHashRouter,
    Navigate,
    ScrollRestoration,
} from "react-router";
import { lazy } from "react";

const Login = lazy(() => import("@/pages/Login"));
const HomeMain = lazy(() => import("@/pages/Home/HomeMain"));
const HomeCommunity = lazy(() => import("@/pages/Home/HomeCommunity"));
const HomeGame = lazy(() => import("@/pages/Home/HomeGame"));
const Community = lazy(() => import("@/pages/Home/HomeGame/Community"));
const Download = lazy(() => import("@/pages/Home/HomeGame/Download"));
const News = lazy(() => import("@/pages/Home/HomeGame/News"));
const Guide = lazy(() => import("@/pages/Home/HomeGame/Guide"));
const HomePersonal = lazy(() => import("@/pages/Home/HomePersonal"));
const Dynamic = lazy(() => import("@/pages/Home/HomePersonal/Dynamic"));
const Upload = lazy(() => import("@/pages/Home/HomePersonal/Upload"));
const HomeCreate = lazy(() => import("@/pages/Home/HomeCreate"));
const PostUpload = lazy(() => import("@/pages/Home/HomeCreate/PostUpload"));
const PostDynamic = lazy(() => import("@/pages/Home/HomeCreate/PostDynamic"));
const PostNews = lazy(() => import("@/pages/Home/HomeCreate/PostNews"));
const HomeContentDetail = lazy(() => import("@/pages/Home/HomeContentDetail"));

import SuspenseLoader from "@/component/SuspenseLoader.tsx";
import Home from "@/pages/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to={"home"} />,
    },
    {
        path: "/home",
        id: "home",
        element: (
            <>
                <ScrollRestoration
                    getKey={(location) => location.pathname} // 按路径区分滚动位置
                />
                <Home />
            </>
        ),
        children: [
            {
                path: "",
                element: (
                    <Navigate
                        to={{
                            pathname: "home-main",
                        }}
                    />
                ),
            },
            {
                path: "home-main",
                id: "home-main",
                element: (
                    <SuspenseLoader>
                        <HomeMain />
                    </SuspenseLoader>
                ),
            },
            {
                path: "home-Community",
                id: "home-Community",
                element: (
                    <SuspenseLoader>
                        <HomeCommunity />
                    </SuspenseLoader>
                ),
            },
            {
                path: "home-personal",
                id: "home-personal",
                element: (
                    <SuspenseLoader>
                        <HomePersonal />
                    </SuspenseLoader>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to={"dynamic"} replace></Navigate>,
                    },
                    {
                        path: "dynamic",
                        id: "dynamic",
                        element: (
                            <SuspenseLoader>
                                <Dynamic />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "upload",
                        id: "upload",
                        element: (
                            <SuspenseLoader>
                                <Upload />
                            </SuspenseLoader>
                        ),
                    },
                ],
            },
            {
                path: "home-game/:gameId",
                id: "home-game",
                element: (
                    <SuspenseLoader>
                        <HomeGame />
                    </SuspenseLoader>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to={"community"} replace></Navigate>,
                    },
                    {
                        path: "community",
                        id: "community",
                        element: (
                            <SuspenseLoader>
                                <Community />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "download",
                        id: "download",
                        element: (
                            <SuspenseLoader>
                                <Download />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "news",
                        id: "news",
                        element: (
                            <SuspenseLoader>
                                <News />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "guide",
                        id: "guide",
                        element: (
                            <SuspenseLoader>
                                <Guide />
                            </SuspenseLoader>
                        ),
                    },
                ],
            },
            {
                path: "home-create",
                id: "home-create",
                element: (
                    <SuspenseLoader>
                        <HomeCreate />
                    </SuspenseLoader>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <Navigate to={"post-dynamic"} replace></Navigate>
                        ),
                    },
                    {
                        path: "post-dynamic",
                        id: "post-dynamic",
                        element: (
                            <SuspenseLoader>
                                <PostDynamic />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "post-upload",
                        id: "post-upload",
                        element: (
                            <SuspenseLoader>
                                <PostUpload />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "post-news",
                        id: "post-news",
                        element: (
                            <SuspenseLoader>
                                <PostNews />
                            </SuspenseLoader>
                        ),
                    },
                ],
            },
            {
                path: "home-content-detail/:contentId",
                id: "home-content-detail",
                element: (
                    <SuspenseLoader>
                        <HomeContentDetail />
                    </SuspenseLoader>
                ),
            },
        ],
    },
    {
        path: "/login",
        id: "login",
        element: (
            <SuspenseLoader>
                <Login />
            </SuspenseLoader>
        ),
    },
    // {
    //     path: "*",
    //     element: <Navigate to={"/home"} />,
    // },
]);
