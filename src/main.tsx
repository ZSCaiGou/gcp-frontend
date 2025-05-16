import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import "./index.css";
import App from "./App.tsx";
import "@/config/axios.config.ts";
import { useCacheStore } from "@/stores/useCacheStore.tsx";

localStorage.removeItem("app-cache");

createRoot(document.getElementById("root")!).render(<App />);
