import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

interface Data {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface Post {
  title: string;
  body: string;
  reactions: number;
  tags: string[];
  id: number;
}

/**
 * Some API Service responsible for making api calls.
 * Typically when consumed by state management libraries such as ngrx,
 * it must be consumed as a side-effect. For ngrx, we use effects.
 */
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private readonly http: HttpClient) { }

  getPosts(page: number): Observable<Post[]> {
    if (!page) {
      return of([]);
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    const params = new HttpParams().set('limit', limit).set('skip', skip);

    return this.http.get<Data>('https://dummyjson.com/posts', { params }).pipe(
      map(data => data.posts),
      tap(posts => console.log(page, posts))
    );
  }
}
