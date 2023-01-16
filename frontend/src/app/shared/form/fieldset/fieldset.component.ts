import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: '[appFieldset]',
  template: `
    <fieldset class="items-center border border-solid border-gray-300 p-3 max-w-sm">
    <legend *ngIf="title !== ''"  class="text-sm">{{title}}:</legend>
      <ng-content></ng-content>
    </fieldset>
  `,
  standalone: true,
  imports: [CommonModule,]
})
export class FieldsetComponent {

  @Input('appFieldset') title = ''
}
