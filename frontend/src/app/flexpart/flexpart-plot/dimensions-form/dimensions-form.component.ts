import { MapPlotAction } from 'src/app/core/state/map-plot.state';
import { GeoJsonSliceResponse } from 'src/app/core/api/v1'
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DropdownQuestion } from 'src/app/shared/form/dropdown-question';
import { QuestionBase } from 'src/app/shared/form/question-base';
import { FlexpartService } from '../../flexpart.service';
import { Store } from '@ngxs/store';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dimensions-form',
  templateUrl: './dimensions-form.component.html',
  styleUrls: ['./dimensions-form.component.scss'],
  providers: [FlexpartService]
})
export class DimensionsFormComponent implements OnChanges {

  @Input() outputId: string
  @Input() layerName: string

  formGroup: FormGroup;

  questions$: Observable<QuestionBase<any>[]>;

  dimForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private flexpartService: FlexpartService,
    private store: Store
  ) {
    this.formGroup = new FormGroup({});
    // this.questions$ = this.route.paramMap.pipe(
    //     switchMap(params => {
    //         const outputId = params.get('outputId');
    //         const layerName = params.get('layerName');
    //         return this.flexpartService.getDimsQuestions(outputId as string, layerName as string);
    //     })
    // )
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGES", changes)
    const newOutId = changes["outputId"] ? changes["outputId"].currentValue : this.outputId;
    const newLayer = changes["layerName"] ? changes["layerName"].currentValue : this.layerName;
    if (newOutId && newLayer) {
      this.formGroup = new FormGroup({});
      this.questions$ = this.flexpartService.getDimsQuestions(newOutId, newLayer);
    }
  }

  onSubmit() {
    // const params = this.route.snapshot.paramMap;
    // const outputId = params.get('outputId');
    // const layerName = params.get('layerName');
    const outputId = this.outputId;
    const layerName = this.layerName;

    // TODO: not very clean, should fine a way to automatically cast values from to select to float or int according to the provided type
    Object.entries(this.formGroup.value.dimensions).forEach(entry => {
      const [key, value] = entry;
      if (key == 'height') {
        this.formGroup.value.dimensions[key] = parseFloat(value as string);
      }
    });

    console.log(this.formGroup.value.dimensions)
    this.flexpartService.getSlice(outputId as string, layerName as string, this.formGroup.value.dimensions).subscribe(res => {
      const geores = res as GeoJsonSliceResponse;
      console.log(geores)
      this.store.dispatch(new MapPlotAction.Add(geores, 'flexpart'))
    });
  }

}
