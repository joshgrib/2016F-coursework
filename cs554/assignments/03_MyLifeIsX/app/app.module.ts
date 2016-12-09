import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./components/app/app.component";
import { PostFormComponent } from "./components/post-form/post-form.component";
import { PostComponent } from "./components/post/post.component";
import { PostDetailComponent } from "./components/post-detail/post-detail.component";
import { PostListComponent } from "./components/post-list/post-list.component";

import { PostService } from "./services/posts/posts.service";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },
      { path: 'posts', component: PostListComponent },
      { path: 'posts/new', component: PostFormComponent },
      { path: 'posts/:id', component: PostDetailComponent },
      { path: 'archive/:id', component: PostListComponent }
    ])
  ],
  declarations: [
    PostComponent, 
    PostListComponent, 
    AppComponent, 
    PostDetailComponent, 
    PostFormComponent
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})

export class AppModule { }
