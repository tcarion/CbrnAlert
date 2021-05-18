export interface FormItem {
    controlName: string,
    label: string,
    type: 'input' | 'select' | 'datepicker',
    placeholder?: any,
    hint?: string,
    validators?: Function[],
    minMaxDate?: {min?: Date, max?: Date},
}
