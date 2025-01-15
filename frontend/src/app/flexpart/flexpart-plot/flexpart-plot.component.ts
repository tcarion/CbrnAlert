import { filter, Observable, Subject, Subscription, take } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FlexpartService } from '../flexpart.service';
import { Store } from '@ngxs/store';
import { FlexpartRun } from 'src/app/core/api/models';
import { DialogService } from 'src/app/shared/ui/dialogs/dialog.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-flexpart-plot',
  templateUrl: './flexpart-plot.component.html',
  styleUrls: ['./flexpart-plot.component.scss'],
})
export class FlexpartPlotComponent implements OnInit {

  constructor(
    public flexpartService: FlexpartService,
    private store: Store,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef,
    public library: FaIconLibrary
  ) { 
    library.addIcons( faPen ) 
  }

  runs$: Observable<FlexpartRun[] | null>;
  value: string;
  name: string;
  pen = faPen;
  isLoading = true;
  @Output() selectedIdEvent = new EventEmitter<string>();

  async ngOnInit(): Promise<void> {
    this.runs$ = this.flexpartService.runs$
    await this.flexpartService.updateRunsFromServer();
    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  onClick(run:FlexpartRun) {
    this.value = run.uuid
    this.name = run.name
    this.selectedIdEvent.emit(run.uuid)
  }

  openDeleteDialog() {
    const dialogData = {
      title: 'Please confirm',
      message: 'Are you sure you want to delete this run?'
    }
    return this.dialogService.confirmDialog(dialogData).pipe(
      take(1)
    );
  }

  deleteRun(uuid: string) {
    this.openDeleteDialog().pipe(
      filter(res => res == true)
    ).subscribe(res => {
      let deleted = this.flexpartService.deleteRun(uuid);
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

  renameRun(uuid: string, currentName: string) {
    this.openRenameDialog(currentName).subscribe(newName => {
      if (newName) {
        console.log(`Renaming file ${currentName} to ${newName}`);
        this.flexpartService.renameRun(uuid, newName).subscribe({
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
}
