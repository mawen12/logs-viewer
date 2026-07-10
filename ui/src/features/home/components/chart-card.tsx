import { StatsChart } from '@/components/chart/stats-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

const stats = [
    {
        "time": 1783682520000,
        "count": 305
    },
    {
        "time": 1783682580000,
        "count": 554
    },
    {
        "time": 1783682640000,
        "count": 301
    },
    {
        "time": 1783682700000,
        "count": 310
    },
    {
        "time": 1783682760000,
        "count": 563
    },
    {
        "time": 1783682820000,
        "count": 263
    },
    {
        "time": 1783682880000,
        "count": 318
    },
    {
        "time": 1783682940000,
        "count": 528
    },
    {
        "time": 1783683000000,
        "count": 414
    },
    {
        "time": 1783683060000,
        "count": 280
    },
    {
        "time": 1783683120000,
        "count": 563
    },
    {
        "time": 1783683180000,
        "count": 257
    },
    {
        "time": 1783683240000,
        "count": 328
    },
    {
        "time": 1783683300000,
        "count": 603
    },
    {
        "time": 1783683360000,
        "count": 288
    }
]

export function ChartCard() {
    const [show, setShow] = useState<boolean>(true);

    const toggleShow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShow(s => !s);
    }

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Logs stats</CardTitle>
                </div>
                <Button variant="outline" size="icon-sm" onClick={toggleShow} >
                    {show ? <IconEye /> : <IconEyeOff />}
                </Button>
            </CardHeader>
            {show && <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <StatsChart data={stats} />
            </CardContent>
            }
        </Card>
    )
}