import { MapAction } from 'src/app/core/state/map.state';
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FlexpartInput } from 'src/app/core/api/v1'
import { FlexpartService } from '../flexpart.service';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputsComponent implements OnInit, OnDestroy {

  inputs$: Observable<FlexpartInput[]>;
  value: string
  // runIds$: Observable<string[]>;
  @Output() selectedIdEvent = new EventEmitter<string>();

  constructor(
    public flexpartService: FlexpartService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.inputs$ = this.flexpartService.getInputs();
  }

  onClick(input:FlexpartInput) {
    this.value = input.uuid
    this.selectedIdEvent.emit(input.uuid)
    this.flexpartService.newSelectedInput(input)
    this.drawArea(input);
  }

  drawArea(input:FlexpartInput) {
    const niceInput = this.flexpartService.niceInput(input);
    this.store.dispatch(new MapAction.ChangeArea(niceInput.area));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new MapAction.RemoveArea());
  }
}
