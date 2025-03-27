// 快速入口
import CardContainer from "@/component/CardShowComponent/CardContainer.tsx";
import ImgCard from "@/component/CardShowComponent/ImgCard.tsx";
import wukong from "@/assets/wukong.png";
import cs from "@/assets/cs.png";
import {
    DatabaseOutlined,
    FolderOpenOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";

function FastForward() {
    const cardList = [];

    cardList.push(
        <ImgCard key={"gr"} size={32} title={"个人中心"}>
            <UserOutlined style={{ fontSize: 24, color: "orange" }} />
        </ImgCard>,
        <ImgCard key={"zy"} size={32} title={"资源库"}>
            <DatabaseOutlined style={{ fontSize: 24, color: "skyblue" }} />
        </ImgCard>,
        <ImgCard key={"sc"} size={32} title={"上传资源"}>
            <FolderOpenOutlined style={{ fontSize: 24, color: "green" }} />
        </ImgCard>,
    );

    return (
        <>
            <CardContainer header={"快速入口"} justify={"space-evenly"}> {cardList} </CardContainer>
        </>
    );
}

function UserPreference() {
    const cardList = [];
    cardList.push(
        <ImgCard navigateTo={"/home/home-game/21"} key={"wukong"} title={"黑神话悟空"} src={wukong}></ImgCard>,
        <ImgCard key={"cs2"} title={"CS2"} src={cs}></ImgCard>,
    );

    return (
        <>
            <CardContainer header={"用户偏好"} justify={"space-evenly"}>{cardList}</CardContainer>
        </>
    );
}

export default function UserActionBar() {
    return (
        <>
            <Flex vertical gap={"middle"} >
                <FastForward />
                <UserPreference />
            </Flex>
        </>
    );
}
