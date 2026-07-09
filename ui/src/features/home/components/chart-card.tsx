import { Chart } from '@/components/business/Chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IconEye } from '@tabler/icons-react';
import { IconEyeOff } from '@tabler/icons-react';
import { useState } from "react";

export function ChartCard() {

    const [show, setShow] = useState<boolean>(true);

    const toggleShow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShow(s => !s);
    }

    return (
        <Card className="flex-none gap-0 py-2">
            <CardHeader>
                <div className="flex flex-row ml-auto gap-2">
                    <Button variant="outline" size="icon-sm" onClick={toggleShow} >
                        {show ? <IconEye /> : <IconEyeOff />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {show && (
                    <div className="h-[200px]">
                        <Chart />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}