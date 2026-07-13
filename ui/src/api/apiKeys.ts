export const apiKeys = {
    items: () => ['items'],
    detail: (id: string) => [...apiKeys.items(), id],
    add: () => [...apiKeys.items(), 'add'],
    delete: () => [...apiKeys.items(), 'delete'],
    update: () => [...apiKeys.items(), 'update'],
}