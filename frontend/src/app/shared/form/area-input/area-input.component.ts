import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { MapAction, MapState } from 'src/app/core/state/map.state';
import { MapArea } from 'src/app/core/models/map-area'
import { first, skip } from 'rxjs/operators';

@Component({
  selector: 'app-area-input',
  templateUrl: './area-input.component.html',
  styleUrls: ['./area-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AreaInputComponent,
    },
  ],
})
export class AreaInputComponent implements ControlValueAccessor, OnDestroy {
  touched = false;

  disabled = false;

  onChange = (value: MapArea) => {};

  onTouched = () => {};

  onChangeSubs: Subscription[] = [];

  @Select(MapState.userArea) userArea$: Observable<MapArea>;

  constructor(public store: Store) {}

  form = new FormGroup<ControlsOf<MapArea>>({
    left: new FormControl<number>(undefined, [Validators.required]),
    right: new FormControl<number>(undefined, [Validators.required]),
    top: new FormControl<number>(undefined, [Validators.required]),
    bottom: new FormControl<number>(undefined, [Validators.required]),
  });

  setArea(area: MapArea) {
    if (area !== undefined) {
      this.form.setValue(area);
    }
  }

  setFromRectangle() {
    this.userArea$.pipe(
      // skip(1),
      first(),
  ).subscribe(
      area => this.setArea(area)
  )
  }

  onEnter() {
    const value = this.form.value
    if (value !== undefined && this.form.valid) {
        this.store.dispatch(new MapAction.ChangeAreaSelection(value))
    }
}

  writeValue(value: MapArea) {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: any) {
    const sub = this.form.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  ngOnDestroy() {
    for (let sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }
}
