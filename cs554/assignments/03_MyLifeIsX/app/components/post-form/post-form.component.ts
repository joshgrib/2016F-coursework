import {Component, Input} from "@angular/core";
import {IPost} from "../../interfaces/posts/ipost";

@Component({
    selector: "post-form",
    templateUrl: "./app/components/post-form/post-form.component.html"
})
export class PostFormComponent {
    newPost: IPost;
    @Input() post: IPost;
}
