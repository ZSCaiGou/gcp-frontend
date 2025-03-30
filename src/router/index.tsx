import {
    createBrowserRouter,
    createHashRouter,
    Navigate,
    ScrollRestoration,
} from "react-router";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import HomeMain from "@/pages/Home/HomeMain";
import HomeCommunity from "@/pages/Home/HomeCommunity";
import HomeGame from "@/pages/Home/HomeGame";
import Community from "@/pages/Home/HomeGame/Community";
import Download from "@/pages/Home/HomeGame/Download";
import News from "@/pages/Home/HomeGame/News";
import Guide from "@/pages/Home/HomeGame/Guide";
import HomePersonal from "@/pages/Home/HomePersonal";
import Dynamic from "@/pages/Home/HomePersonal/Dynamic";
import Upload from "@/pages/Home/HomePersonal/Upload";
import HomeCreate from "@/pages/Home/HomeCreate";
import PostUpload from "@/pages/Home/HomeCreate/PostUpload";
import PostDynamic from "@/pages/Home/HomeCreate/PostDynamic";
import PostNews from "@/pages/Home/HomeCreate/PostNews";

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
                element: <HomeMain />,
            },
            {
                path: "home-Community",
                id: "home-Community",
                element: <HomeCommunity />,
            },
            {
                path: "home-personal",
                id: "home-personal",
                element: <HomePersonal />,
                children: [
                    {
                        index: true,
                        element: <Navigate to={"dynamic"} replace></Navigate>,
                    },
                    {
                        path: "dynamic",
                        id: "dynamic",
                        element: <Dynamic />,
                    },
                    {
                        path: "upload",
                        id: "upload",
                        element: <Upload />,
                    },
                ],
            },
            {
                path: "home-game/:id",
                id: "home-game",
                element: <HomeGame />,
                children: [
                    {
                        index: true,
                        element: <Navigate to={"community"} replace></Navigate>,
                    },
                    {
                        path: "community",
                        id: "community",
                        element: <Community />,
                    },
                    {
                        path: "download",
                        id: "download",
                        element: <Download />,
                    },
                    {
                        path: "news",
                        id: "news",
                        element: <News />,
                    },
                    {
                        path: "guide",
                        id: "guide",
                        element: <Guide />,
                    },
                ],
            },
            {
                path: "home-create",
                id: "home-create",
                element: <HomeCreate />,
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
                        element: <PostDynamic />,
                    },
                    {
                        path: "post-upload",
                        id: "post-upload",
                        element: <PostUpload />,
                    },
                    {
                        path: "post-news",
                        id: "post-news",
                        element: <PostNews />,
                    }
                ],
            },
        ],
    },
    {
        path: "/login",
        id: "login",
        element: <Login />,
    },
    // {
    //     path: "*",
    //     element: <Navigate to={"/home"} />,
    // },
]);
