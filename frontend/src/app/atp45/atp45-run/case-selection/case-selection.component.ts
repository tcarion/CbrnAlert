import { StabilityClass } from './../form-interfaces';
import { Atp45ApiService } from 'src/app/core/api/services';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Atp45DecisionTree } from 'src/app/core/api/models';

@Component({
  selector: 'app-case-selection',
  templateUrl: './case-selection.component.html',
  styleUrls: ['./case-selection.component.scss'],
})
export class CaseSelectionComponent implements OnInit {
  @Output() selectedEvent = new EventEmitter<string[]>()
  @Output() isValid = new EventEmitter<boolean>()
  @Output() requiredInputs = new EventEmitter<{ stabilityRequired: boolean, numberOfLocations: number }>()

  decisionTree: Atp45DecisionTree;
  currentChildren: Atp45DecisionTree[];

  isRoot = true;
  isLeaf = false;

  stabilityRequired = false;
  numberOfLocations = 1;

  selectedCategories: string[] = [];
  savedIndices: number[] = [];

  constructor(private api: Atp45ApiService) {}

  ngOnInit(): void {
    this.api.atp45TreeGet().subscribe((res) => {
      this.decisionTree = res;
      this.currentChildren = this.decisionTree.children
      this.isRoot = true;
    });
  }

  saveAndChangeChildren(event: number) {
    const selectedChild = this.currentChildren[event];

    // Save the selected category
    this.selectedCategories.push(selectedChild.id);

    // We save the previous selected indices for the `goToPreviousCategory` function
    this.savedIndices.push(event);

    if (selectedChild.children[0].children.length == 1) {
      // Leaf of the tree has been reached
      console.log('Leaf reached');
      this.isLeaf = true;
      this.updateEvents();
      return
    }

    if (this.childrenIsStability(selectedChild)) {
      this.stabilityRequired = true;

      // we pass through the stability choice, since it's handle by the Meteo form, or retrived by meteo data.
      this.currentChildren = selectedChild.children[0].children;
      this.isRoot = false;
      this.updateEvents();
      return;
    }

    if (this.childrenIsWind(selectedChild)) {
      // we pass through the wind choice, since it's handle by the Meteo form, or retrived by meteo data.
      this.currentChildren = selectedChild.children[0].children;
      this.isRoot = false;
      this.updateEvents();
      return;
    }

    // Go to the next children
    this.currentChildren = selectedChild.children;
    this.isRoot = false;

    this.updateEvents()
  }

  goToPreviousCategory() {
    this.selectedCategories.pop();
    this.savedIndices.pop();
    let previousTree = this.decisionTree;
    this.isLeaf = false;

    this.stabilityRequired = false;
    this.savedIndices.forEach(i => {
      previousTree = previousTree.children[i];

      if (this.childrenIsStability(previousTree)) {
        this.stabilityRequired = true;
        previousTree = previousTree.children[0];
      }

      if (this.childrenIsWind(previousTree)) {
        previousTree = previousTree.children[0];
      }

    });


    this.currentChildren = previousTree.children;

    if (previousTree.id == "root") {
      this.isRoot = true;
      this.updateEvents()
    }
    this.updateEvents()
  }

  updateEvents() {
    this.selectedEvent.emit(this.selectedCategories);
    this.isValid.emit(this.isLeaf);
    this.requiredInputs.emit(this.getRequired())
  }

  getRequired() {
    return {
      stabilityRequired: this.stabilityRequired,
      numberOfLocations: this.numberOfLocations
    }
  }

  childrenIsStability(tree:Atp45DecisionTree) {
    return tree.children[0].paramtype == "meteo"
  }

  childrenIsWind(tree:Atp45DecisionTree) {
    return tree.children[0].paramtype == "windchoice"
  }
  // nextChoiceIsWind() {
  //   this.currentChildren[0].children.length == 1
  // }
}
