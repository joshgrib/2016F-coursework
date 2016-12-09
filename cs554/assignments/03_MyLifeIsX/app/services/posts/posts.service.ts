import { Injectable } from "@angular/core";
import { IPost } from "../../interfaces/posts/ipost";

import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PostService {
    private _postUrl: string = "/p";

    constructor(private http: Http) {
    }

    async getAllPosts(): Promise<IPost[]> {
        return this.http.get(this._postUrl)
            .map(res => {
                return res.json() || [];
            })
            .toPromise();
    };

    async getSomePosts(pageNum: number): Promise<IPost[]> {
        return this.http.get(this._postUrl + '/' + pageNum)
            .map(res => {
                return res.json() || [];
            })
            .toPromise();
    }

    async getPostById(id: number) {
        return this.http.get(`${this._postUrl}/${id}`)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async createPost(newPost: any) {
        return this.http.post(`${this._postUrl}`, newPost)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async updatePost(updatedPost: IPost) {
        return this.http.put(`${this._postUrl}`, updatedPost)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async deletePost(id: number) {
        return this.http.delete(`${this._postUrl}/${id}`)
            .map(res => {
                return res.json() || undefined;
            })
            .toPromise();
    };

    async searchPosts(searchData: IPost): Promise<IPost[]> {
        let params: URLSearchParams = new URLSearchParams();

        Object.keys(searchData).forEach((key) => {
            params.set(key, searchData[key]);
        });

        return this.http.get(this._postUrl, { search: params })
            .map(res => {
                return res.json() || [];
            })
            .toPromise();
    };
}
