import { RouterProvider, ScrollRestoration } from "react-router";
import { router } from "./router";
import { ConfigProvider } from "antd";

import { AntdThemeDefault } from "@/config/theme.ts";

function App() {
    return (
        <ConfigProvider theme={AntdThemeDefault}>
            <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
    );
}

export default App;
