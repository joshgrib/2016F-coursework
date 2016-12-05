import { Component } from "@angular/core";
import { OnInit } from "@angular/core";

import { IBook } from "../../interfaces/books/ibook";
import { BookService } from "../../services/books/books.service";

@Component({
    selector: "book-list",
    templateUrl: "./app/components/book-list/book-list.component.html"
})
export class BookListComponent implements OnInit {
    bookList: IBook[];

    async ngOnInit() {
        this.bookList = await this.bookService.getAllBooks();
    }

    constructor(private bookService: BookService) { }
}
