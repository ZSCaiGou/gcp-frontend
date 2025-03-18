import { Button, Layout } from "antd";
import { useState } from "react";
import Login from "@/pages/Login";

const { Header, Content, Footer } = Layout;

const handleClick = () => {};

export default function Home() {
  const [loginMoal, setLoginMoal] = useState<boolean>(false);

  return (
    <>
      <Layout>
        <Header className="fixed top-0 z-10 flex w-full items-center">
          {" "}
          Header{" "}
        </Header>

        <Content>
          <Button onClick={handleClick}> 登录窗口</Button>
        </Content>

        <Footer> Footer </Footer>
      </Layout>
    </>
  );
}
