import { IUSer } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: IUSer | null;
  authError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state: State = initialState,
  action: AuthActions.AuthActions
): State {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new IUSer(
        action.payload.userId,
        action.payload.email,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user,
        loading: false,
        authError: null,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };

    case AuthActions.SIGNUP_START:
    case AuthActions.LOGIN_START:
      return {
        ...state,
        loading: true,
        authError: null,
      };

    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };

    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError:null
      }

    default:
      return state;
  }
}
