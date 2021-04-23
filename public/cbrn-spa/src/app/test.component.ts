import { TestService } from './test.service';
import { Component } from '@angular/core';

@Component({
  selector: 'test',
  template: `
  <h2> {{ getTitle() }} </h2>
  <ul>
    <li *ngFor="let course of courses"> {{ course }}</li>
  </ul>
  `,
})
export class TestComponent {
    title = "List fo courses";
    courses;

    constructor(service: TestService) {
        // let service = new TestService();
        this.courses = service.getCourses();
    }
    getTitle() {
        return this.title
    }
}
