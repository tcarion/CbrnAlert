import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { catchError, of, throwError } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FlexpartService } from '../flexpart.service';

const gridResolutions = [
  1.,
  0.5,
  0.2
]

const timeSteps = [{
  key: 1*60*60,
  value: '1 hour'
},
{
  key: 3*60*60,
  value: '3 hours'
},
{
  key: 6*60*60,
  value: '6 hours'
}]

@Component({
  selector: 'app-retrieve-meteo-simple',
  templateUrl: './retrieve-meteo-simple.component.html',
  styleUrls: ['./retrieve-meteo-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetrieveMeteoSimpleComponent {

  startTime = dayjs().subtract(2, 'day').startOf('day').toDate()
  endTime = dayjs().subtract(1, 'day').startOf('day').toDate()
  steps = {hour: 12, minute: 0, second: 0};

  form = new UntypedFormGroup({
    start: new UntypedFormControl(this.startTime, Validators.required),
    end: new UntypedFormControl(this.endTime, Validators.required),
    area: new UntypedFormControl('', Validators.required),
    timeStep: new UntypedFormControl(timeSteps[0].key, Validators.required),
    gridres: new UntypedFormControl(gridResolutions[0], Validators.required),
  })

  gridResolutions = gridResolutions;
  timeSteps = timeSteps;

  constructor(
    private flexpartService: FlexpartService,
    private notification: NotificationService
  ) { }

  submit(form: UntypedFormGroup) {
    console.log(form)
    this.flexpartService.retrieveSimple(form.value).pipe(
      catchError((err, caught) => {
        this.notification.snackBar(`The retrieval failed with the following message: ${err.message}.`, {timeout: 10000, status: "error"})

        return throwError(() => err)

      })
    )

    .subscribe(res => {
      // TODO: add the result input to the app state (flexpartService.fpInputs$ ?)
      // console.log(res)
      this.notification.snackBar("Your request for meteorological retrieval has been started. It can take up to 2 hours to be fullfilled.", {timeout: 10000, status: "info"})
    })
  }
}
