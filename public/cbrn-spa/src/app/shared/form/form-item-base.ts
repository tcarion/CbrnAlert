import { ValidationErrors } from '@angular/forms';
export class FormItemBase {
    value?: string | number;
    key: string;
    label: string;
    required: boolean;
    disabled: boolean;
    order: number;
    controlType: string;
    type: string;
    options: { key: string | Date | number, value?: any, object?: any }[];
    autoSelect: boolean;
    hint: string;
    validators?: Array<(a: any | undefined) => (ValidationErrors | null)>;
    mapper?: (a: any) => string;
    minmax?: { min?: any, max?: any };

    constructor(options: {
        value?: string | number;
        key?: string;
        label?: string;
        required?: boolean;
        disabled?: boolean;
        order?: number;
        controlType?: string;
        type?: string;
        options?: { key: string | Date | number, value?: any, object?: any }[];
        autoSelect?: boolean;
        hint?: string;
        validators?: Array<(a: any | undefined) => (ValidationErrors | null)>;
        mapper?: (a: any) => string;
        minmax?: { min?: any, max?: any };
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.disabled = options.disabled || false;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
        this.autoSelect = !!options.autoSelect;
        this.hint = options.hint || '';
        this.validators = options.validators || [];
        this.mapper = options.mapper || undefined;
        this.minmax = options.minmax || undefined;

        if (this.options?.length !== 0 && this.options[0].value === undefined) {
            this.options.forEach(e => e.value = e.key);
        }
    }
}