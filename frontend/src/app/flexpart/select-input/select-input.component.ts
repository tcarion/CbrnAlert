import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { FlexpartInputAction, FlexpartState } from 'src/app/core/state/flexpart.state';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent implements OnInit {

  @Select(FlexpartState.fpInputs) inputs$: Observable<FlexpartInput[]>;

  constructor(
    private store: Store,
    private flexpartService: FlexpartService
  ) { }

  ngOnInit(): void {
    this.store.selectSnapshot(state => state.flexpart.fpResults).length == 0 && 
            this.flexpartService.getInputs().subscribe(results => 
                results.forEach(result => this.store.dispatch(new FlexpartInputAction.Add(result))));
  }

}
