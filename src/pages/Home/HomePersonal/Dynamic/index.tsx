import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore.tsx";
import { getUserDynamic } from "@/api/user.api.ts";

export default function Dynamic() {
    const [dynamicList, setDynamicList] = useState();
    const userStore = useUserStore.getState();
    useEffect(() => {
        getUserDynamic().then((res) => {
            console.log(res);
        });
    }, []);
    return <div>Dynamic</div>;
}
