import React from "react";
import { Spin } from "antd";

interface SuspenseLoaderProps {
    children: React.ReactNode;
}

function Loading() {
    return (
        <div className="flex w-full h-full items-center justify-center py-2">
            <Spin size="small" />
        </div>
    );
}

export default function SuspenseLoader({ children }: SuspenseLoaderProps) {
    return <React.Suspense fallback={<Loading />}>{children}</React.Suspense>;
}
