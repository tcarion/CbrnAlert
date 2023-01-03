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


  decisionTree: Atp45DecisionTree;
  currentChildren: Atp45DecisionTree[];

  isRoot = true;
  isLeaf = false;

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

    if (this.currentChildren[0] == null) {
      // Leaf of the tree has been reached
      console.log('Leaf reached');
      this.isLeaf = true;
    } else {
      // Go to the next children
      this.currentChildren = selectedChild.children;
      this.isRoot = false;
    }
    this.updateEvents()
  }

  goToPreviousCategory() {
    this.selectedCategories.pop();
    this.savedIndices.pop();
    let previousTree = this.decisionTree;

    this.savedIndices.forEach(i => {
      previousTree = previousTree.children[i];
    });

    this.currentChildren = previousTree.children;

    if (previousTree.id == "root") {
      this.isRoot = true;
    }
    this.updateEvents()
  }

  updateEvents() {
    this.selectedEvent.emit(this.selectedCategories);
    this.isValid.emit(this.isLeaf);
  }

}
