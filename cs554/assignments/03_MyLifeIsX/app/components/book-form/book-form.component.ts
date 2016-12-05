import {Component, Input} from "@angular/core";
import {IBook} from "../../interfaces/books/ibook";

@Component({
    selector: "book-form",
    templateUrl: "./app/components/book-form/book-form.component.html"
})
export class BookFormComponent {
    @Input() book: IBook;
}
