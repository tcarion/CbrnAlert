export interface FormItem {
    controlName: string,
    label: string,
    type: 'input' | 'select',
    placeholder?: string | string[],
    hint?: string,
    validators?: Function[],
}
