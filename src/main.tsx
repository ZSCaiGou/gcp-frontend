import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import "./index.css";
import App from "./App.tsx";
import "@/config/axios.config.ts";
import { useCacheStore } from "@/stores/useCacheStore.tsx";

import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
dayjs.locale("zh-cn");
localStorage.removeItem("app-cache");

createRoot(document.getElementById("root")!).render(<App />);
