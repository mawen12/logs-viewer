export const apiKeys = {
    items: () => ['items'],
    tree: () => [...apiKeys.items(), 'tree'],
    detail: (id: string) => [...apiKeys.items(), id],
    add: () => [...apiKeys.items(), 'add'],
    delete: () => [...apiKeys.items(), 'delete'],
    update: () => [...apiKeys.items(), 'update'],
    logs: () => [...apiKeys.items(), "logs"],
}