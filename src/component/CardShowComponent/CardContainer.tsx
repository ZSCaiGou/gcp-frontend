import { Button, Card, Flex } from "antd";

interface CardContainerProps {
    header: string | React.ReactNode;
    children: React.ReactNode;
    justify?:
        | "start"
        | "center"
        | "end"
        | "space-between"
        | "space-around"
        | "space-evenly"
        | "stretch";
    align?: "top" | "middle" | "bottom" | "start" |"center";
}

export default function CardContainer({
    header,
    children,
    justify = "start",
    align = "center",
}: CardContainerProps) {
    return (
        <>
            <Card type={"inner"} className={"!w-full"}>
                <div>{header}</div>
                <Flex
                    style={{ marginTop: "20px" }}
                    gap={"30px"}
                    wrap
                    justify={justify}
                    align={align}
                >
                    {children}
                </Flex>
            </Card>
        </>
    );
}
