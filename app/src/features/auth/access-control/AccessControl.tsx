import Box from '@mui/material/Box';

import useAccessControl from './useAccessControl';

export enum AccessControlScope {
  Page = 'page',
  Function = 'function'
}

export interface IAccessControlProviderProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
  scope: AccessControlScope;
  renderNoAccess?: () => JSX.Element;
}

export const UnAuthorized = () => <Box>You are not authorized in this function</Box>;

export const AccessControl = (props: IAccessControlProviderProps) => {
  const {
    allowedRoles = [],
    renderNoAccess = () => <UnAuthorized />,
    children,
    scope = AccessControlScope.Page
  } = props;

  const { isAuthenticated, user, isValidRole } = useAccessControl();

  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const isPermitted = isValidRole(allowedRoles);

  const isAccess = isAuthenticated && !!user && isPermitted;
  if (scope === AccessControlScope.Function && !isAccess) {
    return <></>;
  } else if (!isAccess) {
    return renderNoAccess();
  }

  return <>{children}</>;
};

export default AccessControl;
