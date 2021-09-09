import { FormItemBase } from 'src/app/shared/form/form-item-base';
import { Input, OnChanges, Self, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ControlValueAccessor, FormControl, NgControl, NG_VALUE_ACCESSOR, ValidationErrors, AbstractControl } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { SelectFormItem } from 'src/app/shared/form/form-item-select';

@Component({
    selector: 'app-autoformat-select',
    templateUrl: './autoformat-select.component.html',
    styleUrls: ['./autoformat-select.component.scss'],
    providers: [
        // {
        //   provide: NG_VALUE_ACCESSOR,
        //   multi:true,
        //   useExisting: AutoformatSelectComponent
        // }
      ]
})
export class AutoformatSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    @Input() item: FormItemBase;
    // valuesObs: Observable<string | Date | number>;
    @ViewChild('eselect') select: ElementRef; 

    onChange = (values: any) => { };

    onTouched = () => { };

    touched = false;

    disabled = false;

    constructor(@Self() public controlDir: NgControl) {
        controlDir.valueAccessor = this;
        // this.valuesObs = from(this.values);
    }

    ngOnInit(): void {
        this.controlDir.control!.setValidators([this.validate.bind(this)]);
        // this.controlDir.control!.updateValueAndValidity();
    }
    
    ngAfterViewInit(): void {
        this.item.autoSelect && this.item.options.length !== 0 && this.controlDir.control?.setValue(this.item.options[0].key, {onlySelf: false})
        // this.controlDir.control && this.controlDir.control.updateValidity();
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     const item = changes.item ? changes.item.currentValue as SelectFormItem : undefined
    //     if (item && item.options.length !== 0 && (item.options[0].value === undefined)) {
    //         for (let i = 0; i < item.options.length; i++) {
    //             if (item.options[0].key instanceof Date) {
    //                 const formated = formatDate(item.options[i].key, 'YYYY-MM-dd @ HH:mm', "en-US")
    //                 item.options[i].value = formated;
    //             } else {
    //                 item.options[i].value = item.options[i].key.toString();
    //             }
    //         }
    //     }
    // }

    writeValue(value: any) {
        if (value !== "") this.select.nativeElement.value = value;
        // this.controlDir.control?.setValue(values, {onlySelf: true})
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    changeEvent(event:any) {
        // this.writeValue(event.target.value)
        // this.controlDir.control?.setValue(event.target.value, {onlySelf: true})
        this.onChange(event.target.value);
        this.onTouched();
    }

    validate() : ValidationErrors | null {
        const isNotValid = this.select.nativeElement.value === 'default';
        if (isNotValid) {
            return {defaultSelect : 'default'}
        }
        return null
    }

}
