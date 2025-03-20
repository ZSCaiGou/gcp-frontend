import { Avatar, Button } from "antd";
import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

export function AvatarBar() {
    const [loginStatus, setLoginStatus] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            {loginStatus ? (
                <Avatar size={32} icon={<UserOutlined />}></Avatar>
            ) : (
                <Button onClick={()=>navigate("/login")}>登录</Button>
            )}
        </>
    );
}
