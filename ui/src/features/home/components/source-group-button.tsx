import { useGetTreeSourcesQuery } from "@/api/sources/getTreeSources";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TreeDeciduous } from "lucide-react";
import { SourceGroupTree } from "./source-group-tree";

export function SourceGroupButton() {
    const { data } = useGetTreeSourcesQuery()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' size='icon'>
                    <TreeDeciduous className=' transition-all' />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <SourceGroupTree nodes={data ?? []} />
            </PopoverContent>
        </Popover>
    )
}