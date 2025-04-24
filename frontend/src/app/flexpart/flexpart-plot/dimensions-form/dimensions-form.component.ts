import { MapPlotAction } from 'src/app/core/state/map-plot.state';
import { GeoJsonSliceResponse } from './../../../core/api/models/geo-json-slice-response';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DropdownQuestion } from 'src/app/shared/form/dropdown-question';
import { QuestionBase } from 'src/app/shared/form/question-base';
import { FlexpartService } from '../../flexpart.service';
import { Store } from '@ngxs/store';
import { switchMap, tap } from 'rxjs/operators';
import { SliceResponseType } from 'src/app/flexpart/flexpart-plot-data';

@Component({
  selector: 'app-dimensions-form',
  templateUrl: './dimensions-form.component.html',
  styleUrls: ['./dimensions-form.component.scss'],
})
export class DimensionsFormComponent implements OnChanges {

  @Input() outputId: string
  @Input() layerName: string

  formGroup: UntypedFormGroup;
  questions$: Observable<QuestionBase<any>[]>;
  isLoading = true;

  get responseFormat() {
    return this.flexpartService.selectedSliceType;
  }

  constructor(
    private route: ActivatedRoute,
    private flexpartService: FlexpartService,
    private store: Store
  ) {
    this.formGroup = new UntypedFormGroup({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newOutId = changes["outputId"] ? changes["outputId"].currentValue : this.outputId;
    const newLayer = changes["layerName"] ? changes["layerName"].currentValue : this.layerName;
    if (newOutId && newLayer) {
      this.formGroup = new UntypedFormGroup({});
      this.questions$ = this.flexpartService.getDimsQuestions(newOutId, newLayer).pipe(
        tap((questions) => {
          questions.forEach((question) => {
            if (question.key === 'Ti') {
              question.label = 'Time'; // Change the label to 'Time' for the 'Ti' key
            }
          });
          this.isLoading = false;
        })
      );
    }
  }

  onSubmit() {
    const outputId = this.outputId;
    const layerName = this.layerName;

    // TODO: not very clean, should fine a way to automatically cast values from to select to float or int according to the provided type
    Object.entries(this.formGroup.value.dimensions).forEach(entry => {
      const [key, value] = entry;
      if (key == 'height') {
        this.formGroup.value.dimensions[key] = parseFloat(value as string);
      }
    });

    const toGeoJSON = this.responseFormat == SliceResponseType.GEOJSON

    if (toGeoJSON) {
      this.flexpartService.getSliceJson(outputId as string, layerName as string, toGeoJSON, this.formGroup.value.dimensions).subscribe(res => {
        const geores = res as GeoJsonSliceResponse;
        this.store.dispatch(new MapPlotAction.Add(geores, 'flexpart'))
      })
    } else {
      this.flexpartService.getSliceTiff(outputId as string, layerName as string, toGeoJSON, this.formGroup.value.dimensions).subscribe(res => {
        this.store.dispatch(new MapPlotAction.AddTiff(res, 'flexpart'))
      })
    }
  }

}
