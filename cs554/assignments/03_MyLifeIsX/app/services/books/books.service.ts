import { Injectable } from "@angular/core";
import { IBook } from "../../interfaces/books/ibook";

import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BookService {
    private _bookUrl: string = "/books";

    constructor(private http: Http) {
    }

    async getAllBooks(): Promise<IBook[]> {
        return this.http.get(this._bookUrl)
            .map(res => {
                return res.json() || [];
            })
            .toPromise();
    };

    async getBookById(id: number) {
        return this.http.get(`${this._bookUrl}/${id}`)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async createBook(newBook: IBook) {
        return this.http.post(`${this._bookUrl}`, newBook)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async updateBook(updatedBook: IBook) {
        return this.http.put(`${this._bookUrl}`, updatedBook)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async deleteBook(id: number) {
        return this.http.delete(`${this._bookUrl}/${id}`)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async searchBooks(searchData: IBook): Promise<IBook[]> {
        let params: URLSearchParams = new URLSearchParams();

        Object.keys(searchData).forEach((key) => {
            params.set(key, searchData[key]);
        });

        return this.http.get(this._bookUrl, { search: params })
            .map(res => {
                return res.json() || [];
            })
            .toPromise();
    };
}
