import { MapAction } from 'src/app/core/state/map.state';
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, filter, take } from 'rxjs';
import { FlexpartInput } from 'src/app/core/api/models/flexpart-input';
import { FlexpartService } from '../flexpart.service';
import { DialogService } from 'src/app/shared/ui/dialogs/dialog.service';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputsComponent implements OnInit, OnDestroy {

  inputs$ = this.flexpartService.inputs$;
  value: string
  // runIds$: Observable<string[]>;
  @Output() selectedIdEvent = new EventEmitter<string>();

  constructor(
    public flexpartService: FlexpartService,
    private store: Store,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.flexpartService.updateInputsFromServer();
  }

  onClick(input:FlexpartInput) {
    this.value = input.uuid
    this.selectedIdEvent.emit(input.uuid)
    this.flexpartService.newSelectedInput(input)
    this.drawArea(input);
  }

  drawArea(input:FlexpartInput) {
    const niceInput = this.flexpartService.niceInput(input);
    this.store.dispatch(new MapAction.ChangeArea(niceInput.area));
  }

  openDialog() {
    const dialogData = {
      title: 'Please confirm',
      message: 'Are you sure you want to delete this input?'
    }
    return this.dialogService.confirmDialog(dialogData).pipe(
      take(1)
    );
  }

  delete(uuid: string) {
    this.openDialog().pipe(
      filter(res => res == true)
    ).subscribe(res => {
      let deleted = this.flexpartService.deleteInput(uuid);
      console.log("Deleted:")
      console.log(deleted)
    })
  }

  ngOnDestroy(): void {
    this.store.dispatch(new MapAction.RemoveArea());
  }
}
