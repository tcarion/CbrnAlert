import { DateInputConverter } from './date-input-converter.directive';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimePickerComponent } from './datetime-picker/datetime-picker.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ReactiveFormsModule } from '@angular/forms';
import { AppDatePipe } from 'src/app/shared/pipes/app-date-pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [
    DatetimePickerComponent,
    AppDatePipe,
    DateInputConverter,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
  ],
  exports: [
    DatetimePickerComponent
  ],
  providers: [
    AppDatePipe,
  ]
})
export class DatetimePickerModule { }
