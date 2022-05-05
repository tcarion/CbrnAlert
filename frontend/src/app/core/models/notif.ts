export interface Notif {
    title: string,
    content: string[],
    status: NotifStatus,
    type: NotifType,
    showed: boolean
}

export type NotifStatus = 'succeeded' | 'failed' | 'pending' | 'none'

export type NotifType = 'atp45Request' | 'archiveRequest' | 'metDataRequest' | 'flexpartRun'