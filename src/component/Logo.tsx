import { useTheme } from "@/App.tsx";

export const GameCPLogo = () => {
    const isDark = useTheme.getState().isDark;
    const handleLogoClick = () => {
        useTheme.getState().toggleTheme();
    };
    return (
        <>
            <span
                className={
                    "cursor-pointer bg-transparent text-center font-sans text-4xl font-bold  italic"
                    + (isDark ? " text-white" : " text-black")
                }
                onClick={handleLogoClick}
            >
                GameCP
            </span>
        </>
    );
};
