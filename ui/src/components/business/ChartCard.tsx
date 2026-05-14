import { Card, CardContent } from "../ui/card";
import { Chart } from "./Chart";

export function ChartCard() {

    return (
        <Card className="flex-none ">
            <CardContent className="h-[200px]">
                <Chart />
            </CardContent>
        </Card>
    )
}