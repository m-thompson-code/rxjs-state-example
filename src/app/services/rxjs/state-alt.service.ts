import { Injectable } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  map,
  merge,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Post, PostsService } from '../posts/posts.service';

interface State {
  page: number;
  posts: Post[];
}

const INITIAL_STATE: State = {
  page: 0,
  posts: [],
};

/**
 * This Service should match up with component stores completely
 */
@Injectable()
export class StateAltService {
  // Actions
  readonly setPage$ = new Subject<number>();
  private readonly pageAction$ = this.setPage$.pipe(
    map((page) => ({ value: page, type: 'page-set' as const }))
  );

  readonly setPosts$ = new Subject<Post[]>();
  private readonly postsAction$ = this.setPosts$.pipe(
    map((page) => ({ value: page, type: 'posts-loaded' as const }))
  );

  // Merge for actions into one stream
  readonly state$ = merge(this.pageAction$, this.postsAction$).pipe(
    // Scan to merge action metadata into state
    scan((state, action) => {
      // Reducer - Filter by type
      switch (action.type) {
        case 'page-set':
          return {
            ...state,
            page: action.value,
            posts: state.page === action.value ? state.posts : [],
          };
        case 'posts-loaded':
          return { ...state, posts: action.value };
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
  readonly page$ = this.state$.pipe(
    map((state) => state.page),
    distinctUntilChanged()
  );
  readonly posts$ = this.state$.pipe(
    map((state) => state.posts),
    distinctUntilChanged()
  );

  // Effects
  private readonly postsEffect$ = this.page$.pipe(
    distinctUntilChanged(),
    switchMap((page) =>
      this.postsService.getPosts(page).pipe(
        // Handle potential error within inner pipe.
        catchError(() => EMPTY)
      )
    ),
    tap((posts) => this.setPosts$.next(posts))
  );

  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly postsService: PostsService) {
    // Ensure that all actions dispatched will affect state regardless of any component's subscribing to state
    this.state$.pipe(takeUntil(this.unsubscribe$)).subscribe();
    // Activate effects
    this.postsEffect$.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  // Did you know Services have this lifecycle hook? Yup
  ngOnDestroy(): void {
    // Note that this Service is provided at the root, so you won't see this ever used
    // in this demo. But if you were to provide it at a local component level,
    // you would see this lifecycle callback
    console.log('Bye bye StateAltService');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
