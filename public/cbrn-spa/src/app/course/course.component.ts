import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.sass']
})
export class CourseComponent implements OnInit {
    @Input() deviceName?: string;
    deviceSt = "off";

    constructor() {
    }

    onTrigger(){
        alert("triggered")
    }

    ngOnInit(): void {
    }

}
