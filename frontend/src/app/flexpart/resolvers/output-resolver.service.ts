import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { FlexpartService } from 'src/app/flexpart/flexpart.service';
import { FlexpartOutput } from 'src/app/core/api/models';

@Injectable({
    providedIn: 'root'
})
export class OutputsResolverService {

    constructor(
        private flexpartService: FlexpartService,
        private router: Router,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<FlexpartOutput[]> {
        return this.flexpartService.getOutputs(route.params['runId']);
    }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class OutputResolverService {

//     constructor(
//         private flexpartService: FlexpartService,
//         private router: Router,
//     ) { }

//     resolve(
//         route: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ): Observable<FlexpartOutput> {
//         return this.flexpartService.getOutput(route.parent!.params['fpResultId'], route.params['fpOutputId']);
//     }
// }
