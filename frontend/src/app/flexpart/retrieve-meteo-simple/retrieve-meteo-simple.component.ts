import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
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
export class RetrieveMeteoSimpleComponent implements OnInit {

  form = new FormGroup({
    start: new FormControl(dayjs().startOf('hour').toDate(), Validators.required),
    end: new FormControl(dayjs().startOf('hour').toDate(), Validators.required),
    area: new FormControl('', Validators.required),
    timeStep: new FormControl(timeSteps[0].key, Validators.required),
    gridres: new FormControl(gridResolutions[0], Validators.required),
  })

  steps = {hour: 1, minute: 0, second: 0};

  gridResolutions = gridResolutions;
  timeSteps = timeSteps;

  constructor(
    private flexpartService: FlexpartService,
  ) { }

  ngOnInit(): void {
  }

  submit(form: FormGroup) {
    console.log(form)
    this.flexpartService.retrieveSimple(form.value).subscribe(res => {
      // TODO: add the result input to the app state (flexpartService.fpInputs$ ?)
      console.log(res)
    })
  }
}
