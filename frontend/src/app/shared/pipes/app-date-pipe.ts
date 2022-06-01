import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from 'src/app/core/config/config';

@Injectable()
@Pipe({
  name: 'appDate',
})
export class AppDatePipe implements PipeTransform {
  // constructor(private datePipe: DatePipe) {}


  transform(value: Date | number | string, ...options: string[]): string {
    const formated = dayjs(value).format(DEFAULT_DATE_FORMAT);
    return formated
  }
}

