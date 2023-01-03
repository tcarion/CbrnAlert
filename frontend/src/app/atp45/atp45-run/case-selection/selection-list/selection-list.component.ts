import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Atp45DecisionTree } from 'src/app/core/api/models';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent {

  @Input() children: Atp45DecisionTree[]
  @Output() selected = new EventEmitter<number>()

  select(event:number) {
    console.log(event)
    this.selected.emit(event)
  }
}
