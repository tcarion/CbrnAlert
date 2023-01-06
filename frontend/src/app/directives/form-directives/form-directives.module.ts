import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputDirective } from './form-input.directive';

@NgModule({
  declarations: [FormInputDirective],
  imports: [CommonModule],
  exports: [
    FormInputDirective,
  ]
})
export class FormDirectivesModule {}
