import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, distinctUntilChanged, EMPTY, map, Observable, switchMap, tap } from "rxjs";
import { Post, PostsService } from "../posts/posts.service";

interface State {
  page: number;
  posts: Post[];
}

const INITIAL_STATE: State = {
  page: 0,
  posts: [],
};

@Injectable()
export class StateStore extends ComponentStore<State> {
  // Selectors
  readonly page$ = this.state$.pipe(
    map(state => state.page),
  );

  readonly posts$ = this.state$.pipe(
    map(state => state.posts),
  );

  constructor(private readonly postsService: PostsService) {
    super(INITIAL_STATE);

    // Setup effect page$ -> posts$
    this.getPosts(this.page$.pipe(distinctUntilChanged()));
    // ^I don't know how else to set this up without `distinctUntilChanged`
    // Without it, it will infinite loop
  }

  // Actions + Reducers
  readonly setPage = this.updater((state: State, page: number) => ({
    ...state,
    page,
    posts: []
  }));

  readonly setPosts = this.updater((state, posts: Post[]) => ({
    ...state,
    posts
  }));

  // Effects
  private readonly getPosts = this.effect((page$: Observable<number>) => page$.pipe(
    // 👇 Handle race condition with the proper choice of the flattening operator.
    switchMap((page) => this.postsService.getPosts(page).pipe(
      //👇 Act on the result within inner pipe.
      tap((posts) => this.setPosts(posts)),
      // 👇 Handle potential error within inner pipe.
      catchError(() => EMPTY),
    )),
  ));
}
