// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { exhaustMap, map, take, tap } from 'rxjs/operators';

// import { Recipe } from '../recipes/recipe.model';
// import { RecipeService } from '../recipes/recipe.service';
// import * as fromApp from '../store/app.reducer';
// import * as RecipesActions from '../recipes/store/recipes.actions';

// @Injectable({ providedIn: 'root' })
// export class DataStorageService {
//   constructor(
//     private http: HttpClient,
//     private recipeService: RecipeService,
//     private store: Store<fromApp.AppState>
//   ) {}

//   onSaveData() {
//     this.store
//       .select('auth')
//       .pipe(
//         take(1),
//         map((authState) => authState.user),
//         exhaustMap((user) => {
//           const recipes = this.recipeService.getRecipes();
//           return this.http.put(
//             `https://recipebook-6961c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/${user?.id!}/recipes.json`,
//             recipes
//           );
//         })
//       )
//       .subscribe();
//   }

//   onFetchData() {
//     return this.store.select('auth').pipe(
//       take(1),
//       map((authState) => authState.user),
//       exhaustMap((user) => {
//         return this.http
//           .get<Recipe[]>(
//             `https://recipebook-6961c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes/${user?.id!}/recipes.json`
//           )
//           .pipe(
//             map((recipes) => {
//               if (!recipes) {
//                 return [];
//               }
//               return recipes.map((recipes) => {
//                 return {
//                   ...recipes,
//                   ingredients: recipes.ingredients ? recipes.ingredients : [],
//                 };
//               });
//             }),
//             tap((recipes: Recipe[]) => {
//               this.store.dispatch(new RecipesActions.SetRecipes(recipes));
//             })
//           );
//       })
//     );
//   }
// }
