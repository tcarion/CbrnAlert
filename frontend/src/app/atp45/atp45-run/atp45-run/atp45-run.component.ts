import { Component } from '@angular/core';
import { FormGroup, FormRecord } from '@angular/forms';

@Component({
  selector: 'app-atp45-run',
  templateUrl: './atp45-run.component.html',
  styleUrls: ['./atp45-run.component.scss'],
})
export class Atp45RunComponent {

  isCaseSelectionValid = false;
  stabilityRequired: boolean;
  numberOfLocations: number;
  selectedCases: string[];

  runForm = new FormGroup({});

  changeValidity($event: boolean) {
    this.isCaseSelectionValid = $event
  }

  changeRequired($event: any) {
    this.stabilityRequired = $event.stabilityRequired;
    this.numberOfLocations = $event.numberOfLocations;
  }

  changeSelected($event: string[]) {
    this.selectedCases = $event
  }
}
