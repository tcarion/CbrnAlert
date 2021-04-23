import { Component } from '@angular/core';
import { Post } from './post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent {
  posts:Post[] = [
      new Post("Post 1", "Content 1"),
      new Post("Post 2", "Content 2"),
      new Post("Post 3", "Content 3")
    ];

  dev1 = "four";
  dev2 = "micro";
  dev3 = "vibro";
}
