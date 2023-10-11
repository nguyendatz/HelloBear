import { LoginResponse } from 'apis/nswag';
import { useAppContext } from 'app/AppContext';
import { Roles } from 'common/consts/roles';
import { isTokenExpired } from 'features/auth/utils';
export interface IUseAccessControl {
  isValidRole: (allowedRoles: string[]) => boolean;
  isAuthenticated: boolean;
  user: LoginResponse | null | undefined;
  isPermitted: boolean;
}

export interface IUseAccessControlOptions {
  defaultAllowedRoles?: string[];
}

export const useAccessControl = ({ defaultAllowedRoles = [] }: IUseAccessControlOptions = {}): IUseAccessControl => {
  const {
    state: {
      auth: { info: authInfo }
    }
  } = useAppContext();

  const isAuthenticated = !!authInfo?.accessToken && !isTokenExpired(authInfo?.accessToken);

  const isValidRole = (allowedRoles: string[]) => {
    if (allowedRoles.length === 0) {
      return true;
    }

    const userRole = authInfo?.role ?? '';

    return allowedRoles.includes(userRole) || userRole === Roles.SuperAdmin;
  };

  return {
    isValidRole,
    isAuthenticated,
    user: authInfo,
    isPermitted: isValidRole(defaultAllowedRoles)
  };
};

export default useAccessControl;
