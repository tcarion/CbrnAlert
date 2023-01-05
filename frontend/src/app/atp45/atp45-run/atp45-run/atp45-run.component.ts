import { Component, OnInit } from '@angular/core';
import { FormGroup, FormRecord } from '@angular/forms';
import { Atp45Category } from 'src/app/core/api/models';

@Component({
  selector: 'app-atp45-run',
  templateUrl: './atp45-run.component.html',
  styleUrls: ['./atp45-run.component.scss'],
})
export class Atp45RunComponent {
  isCaseSelectionValid = false;
  canSubmit = false;
  stabilityRequired: boolean;
  numberOfLocations: number = 1;
  selectedCases: Atp45Category[];

  runForm = new FormGroup({});

  constructor() {
    this.runForm.statusChanges.subscribe(() => {
      this.updateCanSubmit();
    })
  }

  onCaseValidityChange($event: boolean) {
    this.isCaseSelectionValid = $event
    this.updateCanSubmit();
  }

  changeRequired($event: any) {
    this.stabilityRequired = $event.stabilityRequired;
    this.numberOfLocations = $event.numberOfLocations;
  }

  changeSelected($event: Atp45Category[]) {
    this.selectedCases = $event
  }

  updateCanSubmit() {
    this.canSubmit = this.isCaseSelectionValid && this.runForm.valid;
  }
}
