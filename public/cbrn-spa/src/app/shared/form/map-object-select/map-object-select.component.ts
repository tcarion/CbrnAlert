import { Component, Input, OnInit, ViewChild, ElementRef, Self, AfterViewInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';
import { FormItemBase } from '../form-item-base';

@Component({
  selector: 'app-map-object-select',
  templateUrl: './map-object-select.component.html',
  styleUrls: ['./map-object-select.component.scss']
})
export class MapObjectSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {

    @Input() item: FormItemBase;
    object: any;
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

    }
    
    ngAfterViewInit(): void {
        this.item.autoSelect && this.item.options.length !== 0 && this.controlDir.control?.setValue(this.item.options[0].object, {onlySelf: false})
    }


    writeValue(value: any) {
        if (value !== "") {
            const index = this.item.options.findIndex(e => e.object == value);
            this.object = this.item.options[index]
            this.select.nativeElement.selectedIndex = index + 1;
        }
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    changeEvent(event:any) {
        const index = event.target.selectedIndex - 1;
        // debugger
        this.object = this.item.options[index].object;
        this.onChange(this.object);
        this.onTouched();
    }

    validate() : ValidationErrors | null {
        const isNotValid = this.select.nativeElement.value === 'default';
        if (isNotValid) {
            return {defaultSelect : 1}
        }
        return null
    }
}
