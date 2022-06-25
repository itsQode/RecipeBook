import { Component, OnDestroy, OnInit, Self } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import * as shoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients?: Observable<{ ingredients: Ingredient[] }>;
  subscription?: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onEditItem(index: number) {
    this.store.dispatch(new shoppingListActions.StartEdit(index));
  }
}
