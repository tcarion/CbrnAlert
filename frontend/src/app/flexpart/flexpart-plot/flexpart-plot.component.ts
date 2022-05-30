import { Observable, Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { SelectionTableComponent } from 'src/app/shared/selection-table/selection-table.component';
import { FlexpartService } from '../flexpart.service';
import { ApiService_old } from 'src/app/core/services/api.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import {
  FlexpartRunAction,
  FlexpartState,
} from 'src/app/core/state/flexpart.state';
import { FlexpartRun } from 'src/app/core/api/models';

@Component({
  selector: 'app-flexpart-plot',
  templateUrl: './flexpart-plot.component.html',
  styleUrls: ['./flexpart-plot.component.scss'],
})
export class FlexpartPlotComponent implements OnInit {
  // @Select(FlexpartState.fpResults) runs$: Observable<FlexpartRun[]>;
  runs$: Observable<FlexpartRun[]>;
  // runIds$: Observable<string[]>;

  constructor(
    private flexpartService: FlexpartService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // this.store.selectSnapshot((state) => state.flexpart.runs).length == 0 &&
    this.runs$ = this.flexpartService.getRuns();
      // this.flexpartService
      //   .getRuns()
      //   .subscribe((run) =>
      //     run.forEach((result) =>
      //       this.store.dispatch(new FlexpartRunAction.Add(result))
      //     )
      //   );

    // this.runIds$ = this.runs$.pipe(map((res) => res.map((r) => r.uuid)));
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
