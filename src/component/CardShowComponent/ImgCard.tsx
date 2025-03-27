import { Image } from "antd";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

export interface ImgCardProps {
    src?: string;
    title: string;
    size?: number;
    imgSize?: number;
    children?: ReactNode;
    fontSize?: number;
    navigateTo?: string;
}

export default function ImgCard({
    src,
    title,
    size = 48,
    imgSize = 32,
    children,
    fontSize = 12,
    navigateTo,
}: ImgCardProps) {
    const navigate = useNavigate();
    return (
        <>
            <div
                className={
                    "mt-4 mb-4 flex cursor-pointer flex-col items-center justify-between rounded-full text-gray-600 duration-100 hover:text-gray-950"
                }
                style={{ width: size, height: size }}
                onClick={() => {
                    if (navigateTo) {
                        navigate(navigateTo);
                    }
                }}
            >
                {/*没有src时不显示图片*/}
                {src && (
                    <Image
                        preview={false}
                        width={imgSize}
                        height={imgSize}
                        src={src}
                    ></Image>
                )}
                {children}
                <div
                    className={"text-center text-xs font-thin text-wrap"}
                    style={{ fontSize }}
                >
                    {title}
                </div>
            </div>
        </>
    );
}
