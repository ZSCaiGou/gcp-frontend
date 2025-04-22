import React from "react";

interface SuspenseLoaderProps {
    children: React.ReactNode;
}

function Loading() {
    return (
        <>
            loading...
        </>
    );
}

export default function SuspenseLoader({ children }: SuspenseLoaderProps) {
    return <React.Suspense fallback={<Loading />}>{children}</React.Suspense>;
}
