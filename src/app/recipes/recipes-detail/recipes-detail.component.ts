import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import * as shoppingListActions from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css'],
})
export class RecipesDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  index?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => +params['id']),
        switchMap((id) => {
          this.index = id;
          return this.store.select('recipes');
        }),
        map((reciepsState) => {
          return reciepsState.recipes.find((_recipe, index) => {
            return index === this.index;
          });
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe!;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(new shoppingListActions.AddIngredients(this.recipe!.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.index!));
    this.router.navigate(['/recipes']);
  }
}
