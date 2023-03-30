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
  // Actions
  readonly setPage$ = new Subject<number>;

  private readonly pageAction$ = this.setPage$.pipe(map(page => ({ value: page, type: 'page-set' as const })));

  // Effect + Posts Action
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
    // This doesn't match with how ngrx's component store handles effects
    // Notes at bottom of service with why.
    this.postsEffect$,
  ).pipe(
    // Scan to merge action metadata into state
    scan((state, action) => {
      // Reducer - Filter by type
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

// This implementation doesn't handle effects just like ngrx,
// but I feel like this is a better approach
// One key difference is that this effect only functions if there's at least one subscription
// To better match ngrx, the state must be subscribed from the service,
// or at least the effect must be subscribed somewhere
