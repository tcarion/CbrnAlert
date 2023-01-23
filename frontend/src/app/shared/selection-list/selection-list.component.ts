import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'my-selection-list',
    templateUrl: './selection-list.component.html',
    styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent implements OnInit {

    @Input() elements: string[] | null;

    @Output() selected = new EventEmitter<number>()

    constructor() { }

    ngOnInit(): void {
    }

}
