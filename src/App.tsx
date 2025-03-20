import { RouterProvider } from "react-router";
import { router } from "./router";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { AntdThemeDefault } from "@/config/theme.ts";

function App() {
    return (
        <ConfigProvider theme={AntdThemeDefault}>
            <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
    );
}

export default App;
