import { Button, Card, Flex } from "antd";

interface CardContainerProps {
    title: string;
    children: React.ReactNode;
    justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly" | "stretch";
}

export default function CardContainer({
    title,
    children,
    justify = "start",
}: CardContainerProps) {
    return (
        <>
            <Card type={"inner"}>
                <Button variant={"text"} color={"default"}>
                    {title}
                </Button>
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
