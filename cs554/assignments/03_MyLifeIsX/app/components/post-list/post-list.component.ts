import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { IPost } from "../../interfaces/posts/ipost";
import { PostService } from "../../services/posts/posts.service";

@Component({
    selector: "post-list",
    templateUrl: "./app/components/post-list/post-list.component.html"
})
export class PostListComponent implements OnInit {
    postList: IPost[];

    async ngOnInit() {
        let pageNum = parseInt(this.route.snapshot.params['id']);
        console.log('pn: ' + pageNum);
        this.postList = await this.postService.getSomePosts(pageNum);
    }

    constructor(private postService: PostService,
        private route: ActivatedRoute,
        private router: Router) { }
}
