import { ValidationErrors, NgControl, ControlValueAccessor, ValidatorFn, Validators, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, ElementRef, Input, OnInit, Renderer2, Self, ViewChild, AfterViewInit, forwardRef } from '@angular/core';
import { FormItemBase } from '../form-item-base';
import { AutofillMonitor } from '@angular/cdk/text-field';

@Component({
    selector: 'map-object-input',
    templateUrl: './map-object-input.component.html',
    styleUrls: ['./map-object-input.component.scss'],
    providers: [     
        {       provide: NG_VALUE_ACCESSOR, 
                useExisting: forwardRef(() => MapObjectInputComponent),
                multi: true     
        }
    ]
})
export class MapObjectInputComponent implements OnInit, ControlValueAccessor {
    @Input() item: FormItemBase;
    object: any;
    mapped: string;

    // control: FormControl;

    onChange = (values: any) => { };

    onTouched = () => { };

    touched = false;

    touchable = true;
    disabled = false;
    constructor(
        // @Self() public controlDir: NgControl,
        ) {
        // controlDir.valueAccessor = this;
        // this.valuesObs = from(this.values);
    }

    ngOnInit(): void {
        // let validators = [this.validate.bind(this)]
        // // this.item.validators?.forEach(v => validators.push(<() => ValidationErrors | null>v));
        // this.controlDir.control!.addValidators(validators);
        this.touchable = !this.item.disabled;
        // this.controlDir.control!.updateValueAndValidity();
        // this.control = <FormControl>this.controlDir.control!;
    }

    writeValue(value: any) {
        if (value == '') {
            this.object = undefined;
            this.mapped = '';
        } else {
            this.object = value;
            this.mapped = this.item.mapper ? this.item.mapper(value) : '';
        }
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    setDisabledState(isDisabled: boolean) {
        // this._renderer.setProperty(this._input.nativeElement, 'disabled', isDisabled);
        this.disabled = !this.disabled;
    }

    changeEvent(event: any) {
        this.object = event.target.value;
        this.onChange(this.object)
    }

    validate() : ValidationErrors | null {
        const isNotValid = this.object === undefined;
        if (isNotValid) {
            return {noObject : 1}
        }
        return null
    }

}
