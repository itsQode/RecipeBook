import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeGuard } from './recipe.guard';
import { RecipesDetailComponent } from './recipes-detail/recipes-detail.component';
import { RecipesResolverGuard } from './recipes-resolver.guard';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [RecipeGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipesDetailComponent,
        resolve: [RecipesResolverGuard],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
