import { InputWithClean } from "@/components/input-with-clean";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useLogs } from "./logs-provider";

export function Query() {
    const { query, setQuery, limit, setLimit } = useLogs()
    const [_limit, _setLimit] = useState<number[]>([limit])

    const setLimitHandler = useCallback((value: number[]) => {
        _setLimit(value)
        setLimit(value[0])
    }, [_setLimit, setLimit])

    return (
        <div className="flex flex-col gap-2">
            <Field orientation={'vertical'} className="w-full text-xl">
                <Label htmlFor="query">Query:</Label>
                <InputWithClean id="query" placeholder="Awk pattern" value={query} setValue={setQuery} className="h-10 w-full" />
            </Field>

            <div className="flex flex-row items-center justify-between gap-4">
                <Field orientation={'horizontal'} className="w-48 text-xl">
                    <Label htmlFor="limit">Limit:<span className="text-green-600">({limit})</span></Label>
                    <Slider value={_limit} onValueChange={setLimitHandler} defaultValue={[100]} max={1000} min={10} step={20} />
                </Field>
                <Button variant={'outline'} size={'lg'} className="h-10 w-24">
                    <Search />
                    Search
                </Button>
            </div>
        </div>
    )
}