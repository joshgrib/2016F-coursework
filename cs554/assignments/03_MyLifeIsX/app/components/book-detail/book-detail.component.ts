import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { IBook } from "../../interfaces/books/ibook";
import { BookService } from "../../services/books/books.service";

@Component({
    selector: "book-detail",
    templateUrl: "./app/components/book-detail/book-detail.component.html"
})
export class BookDetailComponent {

    book: IBook = <IBook>{};

    async ngOnInit() {
        // snapshot is our current state in time for this route.
        let id = parseInt(this.route.snapshot.params['id']);
        this.book = await this.bookService.getBookById(id);
    }

    constructor(private bookService: BookService,
        private route: ActivatedRoute,
        private router: Router) {
    }
}
