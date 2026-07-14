import { DataTableProvider } from "@/contexts/data-table-provider";
import { sourceTableEntity } from "@/entities/source.entity";
import type { HTMLAttributes } from "react";
import { SourcesDataTable } from "./components/sources-data-table";
import { useSources } from "./components/sources-provider";
import { SourcesTable } from "./components/sources-table";
import { sourceSchema } from "./data/schema";

export type SourcesContentProps = HTMLAttributes<HTMLDivElement>

export function SourcesContent({ className, ...props }: SourcesContentProps) {
    const { data = [], isFetching, refetch, setOpen, setCurrentRow } = useSources()

    return (
        <div className={className} {...props}>
            {/* <SourcesTable data={data} /> */}
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
                getCurrentRow={(tableRow) => sourceSchema.parse(tableRow.original)}
            >
                <SourcesDataTable />
            </DataTableProvider>
        </div>
    )
}