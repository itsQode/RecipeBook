import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {
  fetchRecipes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIEPS),
      withLatestFrom(
        this.store.select('auth').pipe(map((authState) => authState.user))
      ),
      switchMap(([_actionData, user]) => {
        return this.http.get<Recipe[]>(
          `https://recipebook-6961c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/${user?.id!}/recipes.json`
        );
      }),
      map((recipes) => {
        if (!recipes) {
          return [];
        }
        return recipes.map((recipes) => {
          return {
            ...recipes,
            ingredients: recipes.ingredients ? recipes.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    );
  });

  storeRecipes$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('auth'), this.store.select('recipes')),
        switchMap(([_actionData, authState, recipeState]) => {
          return this.http.put(
            `https://recipebook-6961c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/${authState
              .user?.id!}/recipes.json`,
            recipeState.recipes ? recipeState.recipes : []
          );
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
