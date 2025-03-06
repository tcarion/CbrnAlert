import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { FlexpartOutput } from 'src/app/core/api/models';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-choose-output',
    templateUrl: './outputs.component.html',
    styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {

    fpOutputs$: Observable<FlexpartOutput[]>;
    @Output() selectedIdEvent = new EventEmitter<string>();

    @Input()
    get runId() {return this._runId}
    set runId(v:string) {
      this.fpOutputs$ = this.flexpartService.getOutputs(v)
      this._runId = v
    }

    _runId = ''

    value: string
    constructor(
        private flexpartService: FlexpartService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
    }

    onClick(v: string) {
      this.selectedIdEvent.emit(v);
      this.value = v;
    }
}
