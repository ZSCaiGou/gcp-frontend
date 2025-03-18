import { RouterProvider } from "react-router";
import { router } from "./router";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000000",
          colorInfo: "#000000",
          colorWarning: "#e2a730",
          wireframe: true,
        },
      }}
    >
      <RouterProvider router={router}></RouterProvider>
    </ConfigProvider>
  );
}

export default App;
