import { FormItemBase } from "./form-item-base";

export class FormItems<T> {

    constructor(public items: FormItemBase[]) {}

    get(key: string): FormItemBase {
        let fi;
        this.items.forEach((element) => {
            if(element.key === key) {
                fi = element;
            }
        });

        if (fi===undefined) {
            throw(`${key} not found in form`);
        }
        return fi;
    }
}
