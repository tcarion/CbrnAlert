import { Observable, Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FlexpartService } from '../flexpart.service';
import { Store } from '@ngxs/store';
import { FlexpartRun } from 'src/app/core/api/models';

@Component({
  selector: 'app-flexpart-plot',
  templateUrl: './flexpart-plot.component.html',
  styleUrls: ['./flexpart-plot.component.scss'],
})
export class FlexpartPlotComponent implements OnInit {
  // @Select(FlexpartState.fpResults) runs$: Observable<FlexpartRun[]>;
  runs$: Observable<FlexpartRun[]>;
  value: string
  // runIds$: Observable<string[]>;
  @Output() selectedIdEvent = new EventEmitter<string>();
  constructor(
    public flexpartService: FlexpartService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // this.store.selectSnapshot((state) => state.flexpart.runs).length == 0 &&
    // this.runs$ = this.flexpartService.getRuns();
      // this.flexpartService
      //   .getRuns()
      //   .subscribe((run) =>
      //     run.forEach((result) =>
      //       this.store.dispatch(new FlexpartRunAction.Add(result))
      //     )
      //   );

    // this.runIds$ = this.runs$.pipe(map((res) => res.map((r) => r.uuid)));
    this.runs$ = this.flexpartService.runs$;
    this.flexpartService.updateRunsFromServer();
  }

  onClick(id: string) {
    this.value = id
    this.selectedIdEvent.emit(id)
  }

  deleteRun(uuid: string) {
    this.flexpartService.deleteRun(uuid);
  }

//   goToOuput(index: number) {
//     const run = this.store.selectSnapshot((state) => state.flexpart.runs)[
//       index
//     ];
//     if (run) {
//       this.router.navigate(['flexpart', 'results', run.id], {});
//     } else {
//       this.router.navigate(['flexpart', 'results']);
//     }
//   }
}
