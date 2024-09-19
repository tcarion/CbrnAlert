import { filter, Observable, Subject, Subscription, take } from 'rxjs';
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
import { DialogService } from 'src/app/shared/ui/dialogs/dialog.service';

@Component({
  selector: 'app-flexpart-plot',
  templateUrl: './flexpart-plot.component.html',
  styleUrls: ['./flexpart-plot.component.scss'],
})
export class FlexpartPlotComponent implements OnInit {
  // @Select(FlexpartState.fpResults) runs$: Observable<FlexpartRun[]>;
  runs$ = this.flexpartService.runs$;
  value: string
  // runIds$: Observable<string[]>;
  @Output() selectedIdEvent = new EventEmitter<string>();
  constructor(
    public flexpartService: FlexpartService,
    private store: Store,
    private dialogService: DialogService
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
    this.flexpartService.updateRunsFromServer();
  }

  onClick(id: string) {
    this.value = id
    this.selectedIdEvent.emit(id)
  }

  openDialog() {
    const dialogData = {
      title: 'Please confirm',
      message: 'Are you sure you want to delete this run?'
    }
    return this.dialogService.confirmDialog(dialogData).pipe(
      take(1)
    );
  }

  deleteRun(uuid: string) {
    this.openDialog().pipe(
      filter(res => res == true)
    ).subscribe(res => {
      this.flexpartService.deleteRun(uuid);
    })
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
