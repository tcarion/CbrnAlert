import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// FROM https://coryrylan.com/blog/using-html5-date-input-with-date-objects-and-angular

@Directive({
  selector: 'input[type=datetime-local]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateInputConverter),
    multi: true
  }]
})
export class DateInputConverter implements ControlValueAccessor {
  @HostListener('blur', []) onTouched: any = () => { };
  @HostListener('input', ['$event']) onChange: any = () => { };

  private valueType: 'value' | 'valueAsDate' = 'value';

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  registerOnTouched(fn: () => void) { this.onTouched = fn; }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = (event: any) => fn(event.target[this.valueType])
  }

  writeValue(value: Date | string) {
    this.valueType = typeof value === 'string' ? 'value' : 'valueAsDate';
    this.renderer.setProperty(this.elementRef.nativeElement, this.valueType, value);
  }
}
