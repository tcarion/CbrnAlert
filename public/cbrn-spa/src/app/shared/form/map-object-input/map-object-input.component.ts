import { ValidationErrors, NgControl, ControlValueAccessor, ValidatorFn, Validators } from '@angular/forms';
import { Component, ElementRef, Input, OnInit, Renderer2, Self, ViewChild } from '@angular/core';
import { FormItemBase } from '../form-item-base';

@Component({
    selector: 'map-object-input',
    templateUrl: './map-object-input.component.html',
    styleUrls: ['./map-object-input.component.scss']
})
export class MapObjectInputComponent implements OnInit, ControlValueAccessor {
    @Input() item: FormItemBase<String>;
    object: any;

    @ViewChild('input') _input: ElementRef; 


    onChange = (values: any) => { };

    onTouched = () => { };

    touched = false;

    disabled = false;

    constructor(
        @Self() public controlDir: NgControl,
        ) {
        controlDir.valueAccessor = this;
        // this.valuesObs = from(this.values);
    }

    ngOnInit(): void {
        let validators = [this.validate.bind(this)]
        // this.item.validators?.forEach(v => validators.push(<() => ValidationErrors | null>v));
        // this.controlDir.control!.addValidators(validators);
        this.disabled = this.item.disabled;
        this.controlDir.control!.updateValueAndValidity();
    }

    writeValue(value: any) {
        if (this._input) {
            this.object = value;
            this._input.nativeElement.value = this.item.mapper && this._input ? this.item.mapper(value) : '';
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
        this.onChange(event.target.value)
    }

    validate() : ValidationErrors | null {
        const isNotValid = this.object === undefined;
        if (isNotValid) {
            return {noObject : 1}
        }
        return null
    }

}
