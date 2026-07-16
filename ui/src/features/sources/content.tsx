import { DataTableProvider } from "@/contexts/data-table-provider";
import type { HTMLAttributes } from "react";
import { SourcesDataTable } from "./components/sources-data-table";
import { useSources } from "./components/sources-provider";
import { sourceSchema } from "./data/schema";
import { sourceTableEntity } from "@/entities/source.entity";

export type SourcesContentProps = HTMLAttributes<HTMLDivElement>

export function SourcesContent({ className, ...props }: SourcesContentProps) {
    const { data = [], isFetching, refetch, setOpen, setCurrentRow } = useSources()

    return (
        <div className={className} {...props}>
            <DataTableProvider
                entity={sourceTableEntity}
                data={data}
                loading={isFetching}
                refetchHandler={refetch}
                actionsHandler={() => { }}
                massActionsHandler={() => { }}
                globalActionsHandler={() => { }}
                setOpen={setOpen}
                setCurrentRow={setCurrentRow}
            >
                <SourcesDataTable />
            </DataTableProvider>
        </div>
    )
}