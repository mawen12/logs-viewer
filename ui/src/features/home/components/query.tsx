import { InputWithClean } from "@/components/input-with-clean";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryStore } from "@/store/use-query-store";
import { Search } from "lucide-react";
import { useLogs } from "./logs-provider";

export function Query() {
    const { query, setQuery, limit, setLimit, sources } = useQueryStore()
    const { refetch } = useLogs()

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-4">
                <Field orientation={'vertical'} className="w-full text-xl">
                    <Label htmlFor="query">Query:</Label>
                    <InputWithClean id="query" placeholder="Awk pattern" value={query} setValue={setQuery} className="h-10 w-full" />
                </Field>

                <Field orientation={'vertical'} className="w-24 text-xl">
                    <Label htmlFor="limit">Limit:</Label>
                    <Input id="limit" type="text" inputMode={"numeric"} pattern="[0-9]*" value={String(limit)} onChange={(event) => {
                        const digits = event.target.value.replace(/\D/g, "")
                        const next = digits === "" ? 0 : Number(digits)
                        setLimit(Number.isNaN(next) ? 0 : next)
                    }} className="h-10 w-full " />
                </Field>
            </div>

            <Button variant={'outline'} size={'lg'} className="h-10 w-24 ms-auto" disabled={query === "" || sources.size === 0} onClick={() => refetch()}>
                <Search />
                Search
            </Button>


        </div>
    )
}