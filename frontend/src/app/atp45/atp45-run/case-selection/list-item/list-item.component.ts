import { Component, Input, Output } from '@angular/core';
import { Atp45DecisionTree } from 'src/app/core/api';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

  @Input() item: Atp45DecisionTree

}
