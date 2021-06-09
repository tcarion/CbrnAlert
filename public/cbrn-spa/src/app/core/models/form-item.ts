export interface FormItem {
    controlName: string,
    label: string,
    type: 'input' | 'select' | 'datepicker',
    value?: {
        metadata?: any, 
        obj: any, display: any, 
        withPipe?: {
            pipe: any, 
            arg?: string[]
        },
    },
    hint?: string,
    validators?: Function[],
    minMaxDate?: {
        min?: Date,
        max?: Date
    },
}
