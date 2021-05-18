import { FormItem } from './../interfaces/form-item';
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
            throw("controlName not found");
        }
        return fi;
    }
}
