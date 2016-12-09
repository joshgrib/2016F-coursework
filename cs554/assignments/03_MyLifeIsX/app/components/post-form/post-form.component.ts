import { Component, Input } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { IPost } from "../../interfaces/posts/ipost";
import { PostService } from "../../services/posts/posts.service";


@Component({
    selector: "post-form",
    templateUrl: "./app/components/post-form/post-form.component.html"
})

export class PostFormComponent {
    model = {title: 'My life is pretty good', body:'Heres a story', imageUrl: 'http://www.placecage.com/c/500/300'};

    async newPost(){
        let newPost = this.model;
        return await this.postService.createPost(newPost);
    }

    constructor(private postService: PostService) { }
}
