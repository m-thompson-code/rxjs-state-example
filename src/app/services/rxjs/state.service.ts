import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, merge, scan, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { Post, PostsService } from '../posts/posts.service';

interface State {
  page: number;
  posts: Post[];
}

const INITIAL_STATE: State = {
  page: 0,
  posts: [],
};

@Injectable()
export class StateService {
  // Setter for page action
  readonly setPage$ = new Subject<number>;

  // Page action
  private readonly pageAction$ = this.setPage$.pipe(map(page => ({ value: page, type: 'page-set' as const })));
  // Posts effect + posts action
  private readonly postsEffect$ = this.pageAction$.pipe(
    switchMap(action => this.postsService.getPosts(action.value).pipe(
      // Handle potential error within inner pipe.
      catchError(() => EMPTY),
    )),
    map(posts => ({ value: posts, type: 'posts-loaded' as const})),
  );

  // Merge for actions into one stream
  readonly state$ = merge(
    this.pageAction$,
    this.postsEffect$,
  ).pipe(
    // Scan to merge action metadata into state
    scan((state, action) => {
      // Filter by type
      switch(action.type) {
        case 'page-set':
          return { ...state, page: action.value, posts: [] }
        case 'posts-loaded':
          return { ...state, posts: action.value }
        default:
          // If there's no expected type, ignore
          return state;
      }
    }, INITIAL_STATE),
    // Emit INITIAL_STATE if any actions haven't been emit yet
    startWith(INITIAL_STATE),
    shareReplay({ refCount: false, bufferSize: 0 })
  );

  // Selectors
  readonly page$ = this.state$.pipe(map(state => state.page));
  readonly posts$ = this.state$.pipe(map(state => state.posts));

  constructor(private readonly postsService: PostsService) {

  }
}
