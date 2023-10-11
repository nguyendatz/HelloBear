import { LoginResponse } from 'apis/nswag';
import { getUserPermissions } from 'common/consts/permissions';
import ActionMap from 'common/types/ActionMap';
import { removeAuthInfoFromLocalStorage, saveAuthInfoToLocalStorage } from 'features/auth/utils';

export enum AuthActionTypes {
  AUTH_INFO_SET = 'AUTH_INFO_SET',
  AUTH_LOG_OUT = 'AUTH_LOG_OUT'
}

type AuthPayload = {
  [AuthActionTypes.AUTH_INFO_SET]: LoginResponse;
  [AuthActionTypes.AUTH_LOG_OUT]: undefined;
};

export type AuthStateType = {
  info: LoginResponse | null;
  permissions: string[];
};

export type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export const authReducer = (state: AuthStateType, action: AuthActions) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_INFO_SET:
      saveAuthInfoToLocalStorage(action.payload);

      return {
        ...state,
        info: action.payload,
        permissions: getUserPermissions(action.payload.role)
      };
    case AuthActionTypes.AUTH_LOG_OUT:
      removeAuthInfoFromLocalStorage();
      return {
        info: null,
        permissions: []
      };
    default:
      return state;
  }
};
