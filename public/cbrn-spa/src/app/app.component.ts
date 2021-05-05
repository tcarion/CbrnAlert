import { FormItem } from './interfaces/form-item';
import { ChangeDetectorRef, Component } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    constructor(private brealpointObserver: BreakpointObserver, mediaMatcher: MediaMatcher) {
        this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
      }

    ngOnDestroy(): void {
    }
}
