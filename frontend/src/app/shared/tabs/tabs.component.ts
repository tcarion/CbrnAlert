import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChildren,
  QueryList,
  AfterViewInit,
  AfterContentInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  template: ` <div [hidden]="!active">
    <ng-content></ng-content>
  </div>`,
  styles: [],
  standalone: true,
})
export class TabComponent {
  @Input() id = '';
  @Input() title: string;
  @Input() active = false;
}

@Component({
  selector: 'app-tabs',
  template: `
    <div class="border-b border-gray-200 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li
          class="mr-2"
          *ngFor="let tab of tabs"
          (click)="selectTab(tab)"
        >
          <button
            class="cursor-pointer p-4"
            [ngClass]="{
              'inline-flex border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': !tab.active,
              'inline-flex text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500': tab.active
            }"
          >
            {{ tab.title }}
          </button>
        </li>
      </ul>
    </div>
    <ng-content></ng-content>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, TabComponent],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  get activeTab() {
    return this.tabs.filter((tab) => tab.active)[0];
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
