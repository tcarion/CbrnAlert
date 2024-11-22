import { MapAction } from 'src/app/core/state/map.state';
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, filter, take } from 'rxjs';
import { FlexpartInput } from 'src/app/core/api/models/flexpart-input';
import { FlexpartService } from '../flexpart.service';
import { DialogService } from 'src/app/shared/ui/dialogs/dialog.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
})
export class InputsComponent implements OnInit, OnDestroy {

  constructor(
    public flexpartService: FlexpartService,
    private store: Store,
    private dialogService: DialogService,
    public library: FaIconLibrary
  ) { 
    library.addIcons( faPen ) 
  }

  inputs$ = this.flexpartService.inputs$;
  value: string;
  name: string;
  pen = faPen;
  @Output() selectedIdEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.flexpartService.updateInputsFromServer();
  }

  onClick(input:FlexpartInput) {
    this.value = input.uuid
    this.name = input.name
    this.selectedIdEvent.emit(input.uuid)
    this.flexpartService.newSelectedInput(input)
    this.drawArea(input);
  }

  drawArea(input:FlexpartInput) {
    const niceInput = this.flexpartService.niceInput(input);
    this.store.dispatch(new MapAction.ChangeArea(niceInput.area));
  }

  openDeleteDialog() {
    const dialogData = {
      title: 'Please confirm',
      message: 'Are you sure you want to delete this input?'
    }
    return this.dialogService.confirmDialog(dialogData).pipe(
      take(1)
    );
  }

  delete(uuid: string) {
    this.openDeleteDialog().pipe(
      filter(res => res == true)
    ).subscribe(res => {
      let deleted = this.flexpartService.deleteInput(uuid);
      console.log("Deleted:")
      console.log(deleted)
    })
  }

  openRenameDialog(currentName: string) {
    const dialogData = {
      title: 'Rename file',
      message: 'New name:',
      placeholder: currentName
    }
    return this.dialogService.renameDialog(dialogData).pipe(
      take(1)
    );
  }

  rename(uuid: string, currentName: string) {
    this.openRenameDialog(currentName).subscribe(newName => {
      if (newName) {
        console.log(`Renaming file ${currentName} to ${newName}`);
        this.flexpartService.renameInput(uuid, newName).subscribe({
          next: () => {
            this.name = newName;
            console.log('Rename successful');
          },
          error: (err) => console.error('Rename failed', err)
        });
      } else {
        console.log('Rename canceled');
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new MapAction.RemoveArea());
  }
}
