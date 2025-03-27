import { Menu, MenuProps } from "antd";
import { HomeOutlined, ProductOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

const MenuKey = {
    HomeMain: "home-main",
    HomeCommunity: "home-Community",
};

function getMenuKeyByValue(value: string) {
    for (const key in MenuKey) {
        if (MenuKey[key] === value) {
            return key;
        }
    }
    return null;
}

export default function SiderBar() {
    const [activeMenu, setActiveMenu] = useState("home-main");
    const navigate = useNavigate();
    const location = useLocation();
    const items: MenuItem[] = [
        {
            key: "HomeMain",
            label: "首页",
            icon: <HomeOutlined />,
        },
        {
            key: "HomeCommunity",
            label: "社区",
            icon: <ProductOutlined />,
        },
    ];

    // 菜单选中时触发
    const handleSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
        const path = MenuKey[key];
        console.log(path);
        navigate(path);
        setActiveMenu(key);
    };

    // 路由变化时改变菜单选中状态
    useEffect(() => {
        const path = location.pathname.split("/")[2];
        const key = getMenuKeyByValue(path);
        if (key) {
            setActiveMenu(key);
        }else{
            setActiveMenu("");
        }
    }, [location]);

    return (
        <>
            <Menu
                items={items}
                defaultSelectedKeys={[activeMenu]}
                mode="inline"
                selectedKeys={[activeMenu]}
                className={"!rounded !bg-white"}
                onSelect={handleSelect}
            ></Menu>
        </>
    );
}
