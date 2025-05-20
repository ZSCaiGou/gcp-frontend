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
const HomeSecurity = lazy(() => import("@/pages/Home/SafeCenter"));
const Dynamic = lazy(() => import("@/pages/Home/HomePersonal/Dynamic"));
const Upload = lazy(() => import("@/pages/Home/HomePersonal/Upload"));
const HomeCreate = lazy(() => import("@/pages/Home/HomeCreate"));
const PostUpload = lazy(() => import("@/pages/Home/HomeCreate/PostUpload"));
const PostDynamic = lazy(() => import("@/pages/Home/HomeCreate/PostDynamic"));
const PostNews = lazy(() => import("@/pages/Home/HomeCreate/PostNews"));
const HomeContentDetail = lazy(() => import("@/pages/Home/HomeContentDetail"));
const MessageNotification = lazy(() => import("@/pages/Home/MessageNotification"));

import SuspenseLoader from "@/component/SuspenseLoader.tsx";
import Home from "@/pages/Home";

import SystemAdmin from "@/pages/Admin/System";
import CommunityAdmin from "@/pages/Admin/Community";
import Search from "@/pages/Home/Search";

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
                <ScrollRestoration getKey={(location) => location.pathname} />
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
                path: "home-personal/:userId",
                id: "home-personal-user",
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
                        id: "dynamic-user",
                        element: (
                            <SuspenseLoader>
                                <Dynamic />
                            </SuspenseLoader>
                        ),
                    },
                    {
                        path: "upload",
                        id: "upload-user",
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
              path: "edit-dynamic/:contentId",
              id:'edit-dynamic'  ,
              element: (
                  <SuspenseLoader>
                      <PostDynamic />
                  </SuspenseLoader>
              ),
            },
            {
                path: "edit-news/:contentId",
                id: "edit-news",
                element: (
                    <SuspenseLoader>
                        <PostNews />
                    </SuspenseLoader>
                ),
            },
            {
                path: "edit-upload/:contentId",
                id: "edit-upload",
                element: (
                    <SuspenseLoader>
                        <PostUpload />
                    </SuspenseLoader>
                )
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
            {
                path: "home-security",
                id: "home-security",
                element: (
                    <SuspenseLoader>
                        <HomeSecurity />
                    </SuspenseLoader>
                ),
            },
            {
                path: "home-message",
                id: "home-message",
                element: (
                    <SuspenseLoader>
                        <MessageNotification />
                    </SuspenseLoader>
                ),
            },
            {

                path: "home-search",
                id: "home-search",
                element: (
                    <SuspenseLoader>
                        <Search />
                    </SuspenseLoader>
                )
            }
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
    {
        path: "/admin",
        children: [
            {
                path: "system",
                element: <SystemAdmin />,
            },
            {
                path: "community",
                element: <CommunityAdmin />,
            },
            {
                index: true,
                element: <Navigate to="/admin/system" replace />,
            },
        ],
    },
    // {
    //     path: "*",
    //     element: <Navigate to={"/home"} />,
    // },
]);
