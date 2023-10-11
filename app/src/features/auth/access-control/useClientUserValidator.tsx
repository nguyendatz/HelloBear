import { useEffect, useState } from 'react';

import { RoleList } from 'common/consts/roles';

import { useAppContext } from 'app/AppContext';

interface IProps {
  requestingClientId?: string;
}

interface ClientUserValidationResult {
  isValid?: boolean;
}

export const useClientUserValidator = (props: IProps) => {
  const [state, setState] = useState<ClientUserValidationResult>({ isValid: undefined });
  const {
    state: {
      auth: { info: authInfo }
    }
  } = useAppContext();
  const { requestingClientId } = props;
  const { role, id: clientId } = authInfo ?? {};

  useEffect(() => {
    if (!requestingClientId || !clientId || !role) {
      return;
    }

    setState((prevState) => {
      return {
        ...prevState,
        isValid: RoleList.includes(role) || requestingClientId === clientId
      };
    });
  }, [clientId, requestingClientId, role]);

  return state;
};

export default useClientUserValidator;
