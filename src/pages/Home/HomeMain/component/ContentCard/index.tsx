import { Card, Row, Skeleton } from "antd";
import { useState } from "react";




export default function ContentCard() {

    const [isLoading, setIsLoading] = useState(true);
    return (
        <>
            <Card className={"w-full"} loading={isLoading} type={"inner"} >
                <Row>

                </Row>
            </Card>
        </>
    );
}
