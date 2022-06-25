import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { SignupStarterService } from '../signup-starter.service';
import { IUSer } from '../user.model';
import * as AuthActions from './auth.actions';
import * as RecipesActions from '../../recipes/store/recipes.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  kind: string;
  registered?: boolean;
}

const handleAuthenticate = (
  userId: string,
  email: string,
  token: string,
  expireIn: number
) => {
  const expirationDate = new Date(Date.now() + expireIn * 1000);
  const user = new IUSer(userId, email, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    userId,
    email,
    token,
    expirationDate: expirationDate,
    redirect: true,
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'خطایی رخ داده است !';
  if (!errorRes?.error?.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage =
        ' این ایمیل قبلاً ثبت شده است ،لطفاً ایمیل دیگری وارد کنید';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      errorMessage = ' ایمیل وارد شده معتبر نمیباشد!';
      errorMessage = 'ایمیل یا پسورد وارد شده صحیح نمیباشد!';
      break;
    case 'USER_DISABLED':
      errorMessage = 'این حساب کاربری غیرفعال شده است!';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
      errorMessage =
        'به علت تلاش زیاد و عدم موفقیت اکانت شما موقتا تعلیق شد ، لطفا بعدا تلاش کنید و یا درصورت فراموشی رمز ،درخواست بازنشانی رمز خود را ارسال کنید!';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((AuthData: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.firebaseAPIKey,
            {
              email: AuthData.payload.email,
              password: AuthData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthenticate(
                resData.localId,
                resData.email,
                resData.idToken,
                +resData.expiresIn
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      }),
      switchMap((res) => {
        if (res instanceof AuthActions.AuthenticateSuccess) {
          return [res, new AuthActions.SignupStarterPack(res.payload.userId)];
        }
        return of(res);
      })
    );
  });

  authSignupStarterPack$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.SINGUP_STARTER_PACK),
        tap((authData: AuthActions.SignupStarterPack) => {
          console.log('authData : ' + authData.payload);
          this.signupStarterService.afterSignup(authData.payload);
        })
      );
    },
    { dispatch: false }
  );

  authLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((AuthData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
              environment.firebaseAPIKey,
            {
              email: AuthData.payload.email,
              password: AuthData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthenticate(
                resData.localId,
                resData.email,
                resData.idToken,
                +resData.expiresIn
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      }),
      switchMap((response) => {
        if (response instanceof AuthActions.AuthenticateSuccess) {
          return [response, new RecipesActions.FetchRecipes()];
        }
        return of(response);
      })
    );
  });

  authLogout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      );
    },
    { dispatch: false }
  );

  authRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessActions: AuthActions.AuthenticateSuccess) => {
          if (authSuccessActions.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData')!);
        if (!userData) {
          return { type: 'hich' };
        }

        const loadUser = new IUSer(
          userData.id,
          userData.email,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() - Date.now();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess({
            userId: loadUser.id,
            email: loadUser.email,
            token: loadUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return { type: 'hich' };
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private signupStarterService: SignupStarterService,
    private authService: AuthService
  ) {}
}
