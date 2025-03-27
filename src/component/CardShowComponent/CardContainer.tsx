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
}

export default function CardContainer({
    header,
    children,
    justify = "start",
}: CardContainerProps) {
    return (
        <>
            <Card type={"inner"}>
                <div>{header}</div>
                <Flex
                    style={{ marginTop: "20px" }}
                    gap={"30px"}
                    wrap
                    justify={justify}
                    align={"center"}
                >
                    {children}
                </Flex>
            </Card>
        </>
    );
}
