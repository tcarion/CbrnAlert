import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post';

@Component({
    selector: 'post-list-item',
    templateUrl: './post-list-item.component.html',
    styleUrls: ['./post-list-item.component.sass']
})
export class PostListItemComponent implements OnInit {
    @Input() post: Post = new Post("Not found", "No post has been found");
    constructor() {

    }

    onAddLove() {
        this.post.addLove();
    }

    onSubLove() {
        this.post.subLove();
    }
    ngOnInit(): void {
    }

}
