import { Component, Input, Output } from '@angular/core';
import { Atp45Category, Atp45DecisionTree } from 'src/app/core/api/models';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

  @Input() item: Atp45Category

}
