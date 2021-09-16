import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { FlexpartService } from './flexpart.service';
import { FlexpartResult } from './flexpart-result';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ResultResolverService {

    constructor(
        private flexpartService: FlexpartService,
        private router: Router,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<FlexpartResult> {
        return this.flexpartService.getResult(route.params['fpResultId']);
    }
}
