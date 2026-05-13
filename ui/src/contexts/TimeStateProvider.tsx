import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";

type TimeStateProviderProps = {
    children: React.ReactNode
}

export type TimeParams = {
    from: string,
    to: string,
}

type TimeStateProviderState = {
    // 时间类型
    type: "quick" | "absolute" | "input"
    setType: (type: TimeStateProviderState["type"]) => void
    // type = quick 时值
    range: string
    setRange: (range: string) => void
    // type = absolute 时值
    timeParams: TimeParams
    setTimeParams: (timeParams: TimeParams) => void
    // 展示的描述
    description: string
    setDescription: (description: string) => void
}

const initialState: TimeStateProviderState = {
    type: "quick",
    setType: () => null,
    range: "15m",
    setRange: () => null,
    timeParams: {
        from: "",
        to: "",
    },
    setTimeParams: () => null,
    description: "last 15 minutes",
    setDescription: () => null,
}

const TimeStateProviderContext = createContext<TimeStateProviderState>(initialState)

export function TimeStateProvider({children}: TimeStateProviderProps) {

    const [type, setType] = useState<TimeStateProviderState["type"]>("quick")
    const [range, setRange] = useState("15m")
    const [timeParams, setTimeParams] = useState<TimeParams>({
        from: "",
        to: "",
    })
    const [description, setDescription] = useState<string>("")

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

    const value = {
        type, setType,
        range, setRange,
        timeParams, setTimeParams,
        description, setDescription,
    }

    return (
        <TimeStateProviderContext.Provider value={value}>
            {children}
        </TimeStateProviderContext.Provider>
    )
}

export const useTimeState = () => {
    const context = useContext(TimeStateProviderContext)

    if (context == undefined) {
        throw new Error("useTimeState must be used within a TimeStateProvider")
    }

    return context
}
