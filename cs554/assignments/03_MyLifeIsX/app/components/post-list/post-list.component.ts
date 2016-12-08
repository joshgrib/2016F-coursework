import { Component } from "@angular/core";
import { OnInit } from "@angular/core";

import { IPost } from "../../interfaces/posts/ipost";
import { PostService } from "../../services/posts/posts.service";

@Component({
    selector: "post-list",
    templateUrl: "./app/components/post-list/post-list.component.html"
})
export class PostListComponent implements OnInit {
    postList: IPost[];

    async ngOnInit() {
        this.postList = await this.postService.getAllPosts();
    }

    constructor(private postService: PostService) { }
}
