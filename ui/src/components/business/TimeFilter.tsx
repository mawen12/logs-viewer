import { IconClockHour5 } from "@tabler/icons-react";
import { useState } from "react";
import dayjs from "dayjs";
import { useTimeState } from "@/contexts/TimeStateProvider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const PRESETS = [
    "5m",
    "15m",
    "1h",
    "6h",
    "24h",
    "7d"
]

export function TimeFilter() {
    const { setType,range, setRange, timeParams, setTimeParams,description} = useTimeState();

    // const [range, setRange] = useState("5m")
    // const [type, setType] = useState<"quick" | "absolute" | "input">("quick")

    const [open, setOpen] = useState(false)
    const [from, setFrom] = useState(timeParams.from || dayjs(Date.now()).subtract(15, "minute").format("YYYY-MM-DDTHH:mm"))
    const [to, setTo] = useState(timeParams.to || dayjs(Date.now()).format("YYYY-MM-DDTHH:mm"))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" >
                    <IconClockHour5 /> {description}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Tabs>
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="quick">Quick</TabsTrigger>
                        <TabsTrigger value="absolute">Absolute</TabsTrigger>
                    </TabsList>

                    <TabsContent value="quick" className="space-y-2 mt-3">
                        <div className="grid grid-cols-3 gap-2">
                            {PRESETS.map((p) => (
                                <Button
                                    key={p}
                                    size="sm"
                                    variant={range === p ? "default" : "outline"}
                                    onClick={() => {
                                        setRange(p)
                                        setType("quick")
                                        setOpen(false)
                                    }}
                                >
                                    {p}
                                </Button>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="absolute" className="space-y-3 mt-3">
                        <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">From</div>
                            <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">To</div>
                            <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
                        </div>
                        <Separator />
                        <Button className="w-full" onClick={() => {
                            setType("absolute")
                            setTimeParams({ from, to })
                            setOpen(false)
                        }}>
                            Apply
                        </Button>
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}