import type { DataTableEntity } from "@/types/data-table";

export const sourceTableEntity: DataTableEntity = {
    id: 'sourceTableEntity',
    itemValue: 'id',
    showToolbar: false,
    headers: [
        {
            key: 'data-table-select',
        },
        {
            key: 'id',
            title: 'Id',
            sortable: false,
            filterable: false,
            align: 'start',
            className: 'w-20',
            thClassName: '',
            tdClassName: 'text-break'
        },
        {
            key: 'name',
            title: 'Name',
            sortable: true,
            filterable: true,
            align: 'start',
            className: 'ps-1 text-center',
            thClassName: 'text-center',
            tdClassName: 'text-break'
        },
        {
            key: 'group',
            title: 'Group',
            sortable: true,
            filterable: true,
            align: 'start',
            className: 'ps-1 text-center',
            thClassName: '',
            tdClassName: 'text-break'
        },
        {
            key: 'source',
            title: 'Source',
            sortable: true,
            filterable: true,
            align: 'start',
            className: 'ps-1 max-w-0 w-1/3 text-center',
            thClassName: '',
            tdClassName: 'text-break'
        },
        {
            key: 'pattern',
            title: 'Pattern',
            sortable: true,
            filterable: true,
            align: 'start',
            className: 'ps-1 max-w-0 w-1/3 text-center',
            // thClassName: '',
            // tdClassName: 'text-break'
        },
        {
            key: 'data-table-actions',
            title: 'Actions',
            sortable: false,
            align: 'center',
            className: ''
        }
    ],
    massActions: [],
    globalActions: [
        {
            id: 'evictAll',
            label: 'Evict All',
            icon: 'broom'
        }
    ]
}