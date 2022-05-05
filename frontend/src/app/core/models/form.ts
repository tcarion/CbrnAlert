import { FormItem } from './form-item';
export class Form {

    constructor(public formItems: FormItem[]) {}

    get(controlName: string): FormItem {
        let fi;
        this.formItems.forEach((element: FormItem, index: number) => {
            if(element.controlName === controlName) {
                fi = element;
            }
        });

        if (fi===undefined) {
            throw(`${controlName} not found in form`);
        }
        return fi;
    }

    newVal(controlName: string, val: any) {
        this.get(controlName).value = {
            ...this.get(controlName).value,
            obj: val,
            display: val
        }
    }

    newDistVal(controlName: string, obj: any, disp: any) {
        this.get(controlName).value = {
            ...this.get(controlName).value,
            obj: obj,
            display: disp
        }
    }
}
