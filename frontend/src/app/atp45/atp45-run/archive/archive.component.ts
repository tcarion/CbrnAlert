import { Component, Input } from '@angular/core';
import { FormControl, FormRecord } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent {
  @Input() parentForm: FormRecord;

  form = new FormControl(dayjs().subtract(2, 'day').startOf('day').toDate())
  maxDate = new Date();
  // meteoForm = new FormGroup<MeteoForm>({})
  ngOnInit(): void {
    this.parentForm.addControl('archiveDate', this.form);
  }

  isValid(): boolean {
    return this.form.valid;
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl('archiveDate');
  }
}
