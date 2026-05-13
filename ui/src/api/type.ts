export interface Log {
    stream: string,
    num: string,
    message: string
}

export interface Stat {
    time: string,
    count: number,
}

export interface MessageCompose {
    logs: Log[]
    stats: Stat[]
    stream: string,
}

export interface FetchLogsParams {
    query?: string,
    limit: number,
    from?: string,
    to?: string,
}
