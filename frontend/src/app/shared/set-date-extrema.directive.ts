import { Directive, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';
import * as dayjs from 'dayjs';

@Directive({
  selector: '[appSetDateExtrema]'
})
export class SetDateExtremaDirective implements AfterViewInit {

  @Input('appSetDateExtrema') minMax: {min: Date, max: Date}
  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
      this.elementRef.nativeElement.querySelectorAll("input.datetime-picker").forEach((element:any) => {
        let format = (date:Date) => {return dayjs(date).format("YYYY-MM-DDTHH:mm")}
        this.renderer.setAttribute(element, 'min', format(this.minMax.min))
        this.renderer.setAttribute(element, 'max', format(this.minMax.max))
      });;
  }
}
