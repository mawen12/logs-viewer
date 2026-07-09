import { InputWithClean } from "@/components/input-with-clean";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useState } from "react";

export function Query() {
    const [search, setSearch] = useState<string>('')
    const [limit, setLimit] = useState<number>(100)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-4 w-full">
                <Field orientation={'horizontal'} className="w-full text-xl">
                    <Label htmlFor="query">Query</Label>
                    {/* <InputWithClean id="query" placeholder="Awk pattern" value={search} setValue={setSearch} className="h-12 w-full" /> */}
                    <InputWithClean id="query" placeholder="Awk pattern" value={search} setValue={setSearch} className="h-10 w-full" />
                </Field>
                <Field orientation={'horizontal'} className="w-48 text-xl">
                    <Label htmlFor="limit">Limit</Label>
                    <Input className="h-10 w-full" id="limit" type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
                </Field>
            </div>

            <div className="flex flex-col items-end justify-center gap-4">
                <Button variant={'outline'} size={'lg'} className="h-10 w-24">
                    <Search />
                    Search
                </Button>
            </div>
        </div>
    )
}