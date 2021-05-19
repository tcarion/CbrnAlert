export interface Notif {
    title: string,
    content: string[],
    status: NotifStatus,
    showed: boolean
}

export type NotifStatus = 'succeeded' | 'failed' | 'pending' | 'none'