import { Atp45DecisionTree } from './../../../core/api/model/atp45DecisionTree';
import { Atp45ApiService } from 'src/app/core/api/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-selection',
  templateUrl: './case-selection.component.html',
  styleUrls: ['./case-selection.component.scss'],
})
export class CaseSelectionComponent implements OnInit {

  decisionTree: Atp45DecisionTree
  constructor(
    private api: Atp45ApiService,
  ) {}

  ngOnInit(): void {
    // this.api.get
  }

}
