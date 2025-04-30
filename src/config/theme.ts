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
        "Menu": {
            "itemSelectedBg": "rgba(202,208,212,0.25)",
            "itemSelectedColor": "rgb(0,0,0)"
        },
        "Select": {
            "optionSelectedColor": "rgba(255,252,252,0.88)"
        },
        "Cascader": {
            "optionSelectedColor": "rgba(255,246,246,0.88)"
        },
        "Transfer": {
            "controlItemBgActive": "rgba(64,64,64,0.33)",
            "controlItemBgActiveHover": "rgba(51,51,51,0.3)"
        },
        "TreeSelect": {
            "nodeSelectedColor": "rgba(255,255,255,0.88)"
        },
        "Dropdown": {
            "controlItemBgActive": "rgb(212,212,212)",
            "controlItemBgActiveHover": "rgb(207,207,207)"
        },
        "Table":{
            controlItemBgActive:"rgb(204,204,204)",
            controlItemBgHover:"rgba(210,210,210,0.04)",
            rowSelectedHoverBg:"rgba(202,208,212,0.25)",
            rowSelectedBg:"rgba(202,208,212,0.25)",
            rowHoverBg:"rgba(202,208,212,0.04)",

        }

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
