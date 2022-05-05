import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { FlexpartService } from './flexpart.service';
import { FlexpartResult } from './flexpart-result';
import { catchError } from 'rxjs/operators';
import { FlexpartOutput } from 'src/app/flexpart/flexpart-output';

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
        return this.flexpartService.getOutputs(route.params['fpResultId']);
    }
}

@Injectable({
    providedIn: 'root'
})
export class OutputResolverService {

    constructor(
        private flexpartService: FlexpartService,
        private router: Router,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<FlexpartOutput> {
        return this.flexpartService.getOutput(route.parent!.params['fpResultId'], route.params['fpOutputId']);
    }
}
