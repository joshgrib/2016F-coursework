import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from "./components/app/app.component";
import { BookFormComponent } from "./components/book-form/book-form.component";
import { BookComponent } from "./components/book/book.component";
import { BookDetailComponent } from "./components/book-detail/book-detail.component";
import { BookListComponent } from "./components/book-list/book-list.component";

import { BookService } from "./services/books/books.service";

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'book-list',
        pathMatch: 'full'
      },
      { path: 'book-list', component: BookListComponent },
      { path: 'book-list/new', component: BookFormComponent },
      { path: 'book-list/:id', component: BookDetailComponent }
    ])
  ],
  declarations: [
    BookComponent, BookListComponent, AppComponent, BookDetailComponent, BookFormComponent
  ],
  providers: [BookService],
  bootstrap: [AppComponent]
})

export class AppModule { }
