import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DropdownQuestion } from 'src/app/shared/form/dropdown-question';
import { QuestionBase } from 'src/app/shared/form/question-base';
import { FlexpartService } from '../../flexpart.service';

@Component({
    selector: 'app-dimensions-form',
    templateUrl: './dimensions-form.component.html',
    styleUrls: ['./dimensions-form.component.scss'],
    providers:  [FlexpartService]
})
export class DimensionsFormComponent {

    formGroup: FormGroup;
    dimensions: Map<string, any[]>;

    questions$: Observable<QuestionBase<any>[]>;
    
    dimNames: string[] = [];
    dimValues: any[];

    dimForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private flexpartService: FlexpartService
    ) {
        this.formGroup = new FormGroup({});
        const params = this.route.snapshot.paramMap;
        const outputId = params.get('outputId');
        const layerName = params.get('layerName');

        // this.flexpartService.getZDims(outputId as string, layerName as string).subscribe(dims => {
        //     // const dimMap = new Map<string, any[]>(Object.entries(dims))
        //     const questions: QuestionBase<any>[] = []
        //     for (const [key, values] of Object.entries(dims as { [k: string]: string[] | number[]})) {
        //         const kvs = values.map( (v) => {
        //             return {key:v as string, value: v as string}
        //         })
        //         questions.push(new DropdownQuestion({
        //             key: key,
        //             label: key,
        //             options: kvs,
        //             // order: 3
        //         }))
        //         // this.formGroup.addControl(key, new FormControl(values[0]))
        //         // this.dimNames.push(key);
        //         // this.dimValues.push(values);
        //     }
        //     this.questions$ = of(questions)
        // })
        this.questions$ = this.flexpartService.getDimsQuestions(outputId as string, layerName as string);
     }

     onSubmit() {
        const params = this.route.snapshot.paramMap;
        const outputId = params.get('outputId');
        const layerName = params.get('layerName');
        this.flexpartService.getSlice(outputId as string, layerName as string, this.formGroup.value.dimensions).subscribe(x => console.log(x));
     }

}
