import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogingMode = true;
  isLoading = false;
  error: null | string = null;
  subscription?: Subscription;

  @ViewChild(PlaceholderDirective) alerHost?: PlaceholderDirective;

  private closeSub?: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this._showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLogingMode = !this.isLogingMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value['email'];
    const password = form.value['password'];

    this.isLoading = true;
    if (this.isLogingMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    }
    if (!this.isLogingMode) {
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }
    form.reset();
  }

  private _showErrorAlert(errorMessage: string) {
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alerHost?.viewContainerRef;
    hostViewContainerRef!.clear();

    const componentRef = hostViewContainerRef!.createComponent(
      alertComponentFactory
    );
    componentRef!.instance.message = errorMessage;
    this.closeSub = componentRef!.instance.close.subscribe(() => {
      this.closeSub!.unsubscribe();
      hostViewContainerRef!.clear();
      this.store.dispatch(new AuthActions.ClearError());
    });
  }

  ngOnDestroy(): void {
    this.closeSub?.unsubscribe();
    this.subscription?.unsubscribe();
  }
}
