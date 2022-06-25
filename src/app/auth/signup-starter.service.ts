import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  exhaustMap,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as recipesActions from '../recipes/store/recipes.actions'

@Injectable({
  providedIn: 'root',
})
export class SignupStarterService {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  public afterSignup(userId: string) {
    this._fetchStarterRecipes()
      .pipe(
        take(1),
        exhaustMap(() => {
          return this._saveStarterRecipes(userId);
        })
      )
      .subscribe();
  }

  private _fetchStarterRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recipebook-6961c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/starterPack/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipes) => {
            return {
              ...recipes,
              ingredients: recipes.ingredients ? recipes.ingredients : [],
            };
          });
        }),
        tap((recipes: Recipe[]) => {
          this.store.dispatch(new recipesActions.SetRecipes(recipes))
        })
      );
  }

  private _saveStarterRecipes(userId: string) {
   return this.store.select('recipes').pipe(
      take(1),
      map((recipeState) => recipeState.recipes),
      switchMap((recipes) => {
        return this.http.put(
          `https://recipebook-6961c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/${userId}/recipes.json`,
          recipes
        );
      })
    );
  }
}
