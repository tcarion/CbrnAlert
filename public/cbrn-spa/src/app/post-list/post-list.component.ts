import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post';

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.sass'],
})
export class PostListComponent implements OnInit {
    @Input() postList?: Post[];
    constructor() { }

    ngOnInit(): void {
    }

}
