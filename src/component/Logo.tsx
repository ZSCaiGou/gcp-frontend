import { useTheme } from "@/App.tsx";
import { Flex } from "antd";

export const GameCPLogo = () => {
    const isDark = useTheme.getState().isDark;
    const handleLogoClick = () => {
        useTheme.getState().toggleTheme();
    };
    return (
        <>
            <Flex justify={"center"} align={"center"}>
                <span
                    className={
                        "cursor-pointer bg-transparent text-center font-sans font-bold italic sm:text-3xl md:text-4xl" +
                        (isDark ? " text-white" : " text-black")
                    }
                    onClick={handleLogoClick}
                >
                    GameCP
                </span>
            </Flex>
        </>
    );
};
