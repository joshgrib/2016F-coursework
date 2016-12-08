import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { IPost } from "../../interfaces/posts/ipost";
import { PostService } from "../../services/posts/posts.service";

@Component({
    selector: "post-detail",
    templateUrl: "./app/components/post-detail/post-detail.component.html"
})
export class PostDetailComponent {

    post: IPost = <IPost>{};

    async ngOnInit() {
        // snapshot is our current state in time for this route.
        let id = parseInt(this.route.snapshot.params['id']);
        this.post = await this.postService.getPostById(id);
    }

    constructor(private postService: PostService,
        private route: ActivatedRoute,
        private router: Router) {
    }
}
