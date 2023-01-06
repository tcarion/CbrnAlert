import { Atp45StabilityClasses } from './../form-interfaces';
import { Atp45ApiService } from 'src/app/core/api/services';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Atp45Category, Atp45DecisionTree } from 'src/app/core/api/models';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-case-selection',
  templateUrl: './case-selection.component.html',
  styleUrls: ['./case-selection.component.scss'],
})
export class CaseSelectionComponent implements OnInit {
  @Output() selectedEvent = new EventEmitter<Atp45Category[]>()
  @Output() isValid = new EventEmitter<boolean>()
  @Output() requiredInputs = new EventEmitter<{ stabilityRequired: boolean, numberOfLocations: number }>()

  decisionTree: Atp45DecisionTree;
  currentChildren: Atp45DecisionTree[];

  isRoot = true;
  isLeaf = false;

  stabilityRequired = false;
  numberOfLocations = 1;

  selectedCategories: Atp45Category[] = [];
  get filteredCategories() {
    return this.selectedCategories.filter(cat => cat.paramtype !== "windchoice" &&  cat.paramtype !== "meteo")
  }

  savedIndices: number[] = [];

  constructor(private api: Atp45ApiService) {}

  ngOnInit(): void {
    this.api.atp45TreeGet()
      // .pipe(tap(res => {
      //   this.formatTree(res)
      // }))
      .subscribe((res) => {
        this.decisionTree = res;
        this.currentChildren = this.decisionTree.children
        this.isRoot = true;
      });
  }

  saveAndChangeChildren(event: number) {
    const selectedChild = this.currentChildren[event];

    // Save the selected category
    this.selectedCategories.push(selectedChild);

    // We save the previous selected indices for the `goToPreviousCategory` function
    this.savedIndices.push(event);

    if (selectedChild.children[0].id == "leaf") {
      // Leaf of the tree has been reached
      console.log('Leaf reached');
      this.isLeaf = true;
      this.numberOfLocations = parseInt(selectedChild.children[0].description || "1");
      this.updateEvents();
      return
    }

    if (this.childrenIsStability(selectedChild)) {
      // we pass through the stability choice, since it's handle by the Meteo form, or retrieved by meteo data.
      this.stabilityRequired = true;
      this.currentChildren = selectedChild.children;
      this.saveAndChangeChildren(0);
      // this.currentChildren = selectedChild.children[0].children;
      // this.isRoot = false;
      // this.updateEvents();
      return;
    }
    if (this.childrenIsWind(selectedChild)) {
      // we pass through the wind choice, since it's handle by the Meteo form, or retrieved by meteo data.

      // Sometimes, there's still choices after the wind (e.g. chem, typeA).
      // In that case, we take the worst case by finding the deepest child.
      // Typically, in the example above, if the wind happens to be higher than 10km/h
      // we have the container group to run the procedure.
      // The drawback is that we ask information that is not especially needed to the user (if the wind is lower than 10, we don't need
      // the container group). But that's the compromise to keep it simple.
      const i = this.findDeepestChild(selectedChild);
      this.currentChildren = selectedChild.children;
      this.saveAndChangeChildren(i);
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
    });


    this.currentChildren = previousTree.children;

    if (previousTree.id == "root") {
      this.isRoot = true;
    }

    if (this.childrenIsStability(previousTree) || this.childrenIsWind(previousTree)) {
      this.goToPreviousCategory()
    }

    this.updateEvents()
  }

  updateEvents() {
    this.selectedEvent.emit(this.filteredCategories);
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

  findDeepestChild(tree:Atp45DecisionTree) {
    const depths = tree.children.map(child => this.treeDepth(child));
    const max = Math.max(...depths);
    const index = depths.indexOf(max);
    return index;
  }

  treeDepth(tree:Atp45DecisionTree) {
    // Base case: if the root is null, the depth is 0.
    if (tree.children.length == 0 || tree.children[0] == null) {
      return 0;
    }

    // Recursive case: calculate the depth of each child and take the maximum.
    let maxDepth = 0;
    for (const child of tree.children) {
      maxDepth = Math.max(maxDepth, this.treeDepth(child));
    }

    // Return the depth of this node, plus one to count the current level.
    return maxDepth + 1;
  }

  // Change the tree.children == [null] to tree.children == []
  formatTree(tree:Atp45DecisionTree) {
    if (tree.children.length == 0) {
      return ;
    }

    if (tree.children[1] == null) {
      tree.children.pop()
      return ;
    }

    for (const child of tree.children) {
      this.formatTree(child)
    }
  }
  // nextChoiceIsWind() {
  //   this.currentChildren[0].children.length == 1
  // }
}
