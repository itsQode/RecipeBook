import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationDate: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationDate = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationDate) {
      clearTimeout(this.tokenExpirationDate);
      this.tokenExpirationDate = null;
    }
  }
}
