import { useTimeStore } from "@/store/useTimeStore";
import { IconClockHour5 } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const PRESETS = [
    "5m",
    "15m",
    "1h",
    "6h",
    "24h",
    "7d"
]

export function TimeFilter() {
    const { type, setType, range, setRange, timeParams, setTimeParams, description, setDescription } = useTimeStore();


    const [open, setOpen] = useState(false)
    const [from, setFrom] = useState(timeParams.from || dayjs(Date.now()).subtract(15, "minute").format("YYYY-MM-DDTHH:mm"))
    const [to, setTo] = useState(timeParams.to || dayjs(Date.now()).format("YYYY-MM-DDTHH:mm"))

    useEffect(() => {
        if (type === "quick") {
            setDescription(`last ${range}`)
        }
        else if (type === "absolute") {
            const fromDJ = dayjs(timeParams.from)
            const toDJ = dayjs(timeParams.to || Date.now())
            setDescription(`${fromDJ.format("YYYY-MM-DD HH:mm")} - ${toDJ.format("YYYY-MM-DD HH:mm")}`)
        }
        else if (type === "input") {
            setDescription(`last ${range}`)
        }
    }, [type, range, timeParams])

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