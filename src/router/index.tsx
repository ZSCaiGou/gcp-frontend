import { createBrowserRouter, createHashRouter, Navigate } from "react-router";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import HomeMain from "@/pages/Home/HomeMain";
import HomeCommunity from "@/pages/Home/HomeCommunity";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to={{ pathname: "home" }} />,
    },
    {
        path: "/home",
        id: "home",
        element: <Home />,
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
                path: "home-community",
                id: "home-community",
                element: <HomeCommunity />,
            },
        ],
    },
    {
        path: "/login",
        id: "login",
        element: <Login />,
    },
    {
        path: "*",
        element: <Navigate to={"/home"} />,
    },
]);
