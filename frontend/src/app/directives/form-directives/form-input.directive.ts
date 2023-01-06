import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appFormInput]'
})
export class FormInputDirective {
  private default_classes = 'shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
  protected _elementClass: string[] = this.default_classes.split(' ');

  @HostBinding('class')
  get elementClass(): string {
      return this._elementClass.join(' ');
  }
  set(val: string) {
      this._elementClass = val.split(' ');
  }


  constructor(private el: ElementRef) {
    const classes =
    this._elementClass.push(
    );
  }

}
