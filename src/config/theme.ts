import { theme } from "antd";

export const AntdThemeDefault = {
    token: {
        colorPrimary: "#000000",
        colorInfo: "#000000",
        colorWarning: "#e2a730",
        wireframe: true,
        colorLink: "#a79f9f",
        colorLinkHover: "#13c2c2",
    },
    components: {
        Menu: {
            itemSelectedBg: "rgba(202,208,212,0.25)",
            itemSelectedColor: "rgb(0,0,0)",
        },
    },
};
export const AntdThemeDark = {
    token: {
        colorWarning: "#e2a730",
        wireframe: true,
        colorLinkHover: "#13c2c2",
        colorPrimary: "#487cc4",
        colorInfo: "#487cc4",
        colorBgBase: "#000000",
    },
    components: {
        Menu: {
            itemSelectedBg: "rgba(202,208,212,0.25)",
            itemSelectedColor: "rgb(0,0,0)",
        },
    },
    algorithm: theme.darkAlgorithm,
};
