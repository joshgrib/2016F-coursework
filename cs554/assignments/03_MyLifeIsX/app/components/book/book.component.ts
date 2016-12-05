import {Component, Input} from "@angular/core";
import {IBook} from "../../interfaces/books/ibook";

@Component({
    selector: "book",
    templateUrl: "./app/components/book/book.component.html"
})
export class BookComponent {
    @Input() book: IBook;
}
