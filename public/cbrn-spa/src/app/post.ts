import { Injectable } from "@angular/core";

export interface Post {
    title:string,
    content: string,
    loveIts: number,
    created_at: Date
}

export class Post implements Post {
    created_at: Date;
    constructor(public title: string, public content: string) {
        this.created_at = new Date();
        this.loveIts = 0
    }

    addLove() {
        this.loveIts++;
    }

    subLove() {
        this.loveIts--;
    }
}