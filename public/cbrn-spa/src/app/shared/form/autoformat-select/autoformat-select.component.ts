import { Input, OnChanges, Self, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { from, Observable } from 'rxjs';

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
export class AutoformatSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
    @Input() label: string;
    @Input() values: Array<string | Date | number> = [];
    display: string[] = [];

    // valuesObs: Observable<string | Date | number>;

    onChange = (values: any) => { };

    onTouched = () => { };

    touched = false;

    disabled = false;

    constructor(@Self() public controlDir: NgControl) {
        controlDir.valueAccessor = this;
        // this.valuesObs = from(this.values);
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.values) {
            this.display = [];
            const newVal = changes.values.currentValue
            for (let i = 0; i < newVal.length; i++) {
                if (newVal[0] instanceof Date) {
                    this.display.push(formatDate(newVal[i], 'YYYY-MM-dd @ HH:mm', "en-US"));
                } else {
                    this.display.push(newVal[i].toString());
                }
            }
        }
    }

    writeValue(values: any) {
        // this.controlDir.control?.setValue(this.values[0], {onlySelf: true})
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    changeEvent(event:any) {
        this.controlDir.control?.setValue(event.target.value, {onlySelf: true})
    }

}
