import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseSelectionComponent } from './case-selection/case-selection.component';
import { ListItemComponent } from './case-selection/list-item/list-item.component';
import { SelectionListComponent } from './case-selection/selection-list/selection-list.component';

@NgModule({
  declarations: [CaseSelectionComponent, ListItemComponent, SelectionListComponent],
  imports: [CommonModule],
})
export class Atp45RunModule {}
