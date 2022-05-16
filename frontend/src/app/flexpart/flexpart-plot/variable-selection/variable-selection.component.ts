import { Observable, of, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { FlexpartOutput } from '../../flexpart-output';
import { map } from 'rxjs/operators';
import { FlexpartOutputAction, FlexpartState } from 'src/app/core/state/flexpart.state';

@Component({
    selector: 'app-variable-selection',
    templateUrl: './variable-selection.component.html',
    styleUrls: ['./variable-selection.component.scss']
})
export class VariableSelectionComponent implements OnInit {

    @Select(FlexpartState.getFlexpartOutput)
    fpOutput$: Observable<FlexpartOutput>;
    
    fpOutputVar2D$: Observable<string[]>;

    selectedVarSub = new Subject<string>();
    selectedVar$: Observable<string>;

    constructor(
        private route: ActivatedRoute,
        private store: Store,
    ) {
        this.selectedVar$ = this.selectedVarSub.asObservable();
    }
    
    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.store.dispatch(new FlexpartOutputAction.Add(data.fpOutput));
        })

        this.fpOutputVar2D$ = this.fpOutput$.pipe(map(out => out.variables2d))
    }

    goToVariable(i: number) {
        this.selectedVarSub.next((this.store.selectSnapshot(state => state.flexpart.fpOutput.variables2d[i])));
    }

}
