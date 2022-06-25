import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const SIGNUP_START = '[Auth] SignUp Start';
export const LOGOUT = '[Auth] Logout';
export const SINGUP_STARTER_PACK = '[Auth] Signup Starter Pack';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      userId: string;
      email: string;
      token: string;
      expirationDate: Date;
      redirect:boolean
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string; password: String }) {}
}

export class SignupStarterPack implements Action {
  readonly type = SINGUP_STARTER_PACK;
  constructor(public payload: string) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | SignupStarterPack
  | ClearError
  | AutoLogin
