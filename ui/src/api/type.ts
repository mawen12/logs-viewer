export interface Log {
    id: string,
    time: number,
    stream: string,
    num: number,
    message: string
}

export interface Stat {
    time: number,
    count: number,
}

export interface MessageCompose {
    logs: Log[],
    stats: Stat[],
    stream: string,
}

export interface QueryResponse {
    messageComposes: MessageCompose[],
    stats: Stat[],
}

export interface FetchLogsParams {
    query?: string,
    limit: number,
    from?: string,
    to?: string,
    refresh?: boolean,
}
