import { RouterProvider, ScrollRestoration } from "react-router";
import { router } from "./router";
import { ConfigProvider, ThemeConfig } from "antd";

import { AntdThemeDark, AntdThemeDefault } from "@/config/theme.ts";
import { create } from "zustand/react";
import zhCN from "antd/locale/zh_CN";
// for date-picker i18n
import "dayjs/locale/zh-cn";
interface ThemeState {
    theme: ThemeConfig;
    isDark: boolean;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set) => ({
    theme: AntdThemeDefault,
    isDark: false,
    toggleTheme: () => {
        set((state) => ({
            theme: state.isDark ? AntdThemeDefault : AntdThemeDark,
            isDark: !state.isDark,
        }));
    },
}));

function App() {
    const theme = useTheme((state) => state.theme);
    return (
        <ConfigProvider theme={theme} locale={zhCN}>
            <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
    );
}

export default App;
