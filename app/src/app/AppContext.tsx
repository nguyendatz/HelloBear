import { LoginResponse } from 'apis/nswag';
import { getUserPermissions } from 'common/consts/permissions';
import Language from 'common/types/Language';
import { AuthActions, AuthStateType, authReducer } from 'features/auth/login-reducer';
import { getSavedAuthInfoFromLocalStorage } from 'features/auth/utils';
import { appLang } from 'locales/i18n';
import { Dispatch, PropsWithChildren, createContext, useContext, useMemo, useReducer } from 'react';
import { LanguageActions, languageReducer } from './reducers/languageReducer';

type InitialStateType = {
  language: Language;
  auth: AuthStateType;
};
type AppActionType = LanguageActions | AuthActions;

const initialState: InitialStateType = {
  language: {
    lang: appLang.code,
    ns: appLang.ns
  },
  auth: {
    info: null,
    permissions: []
  }
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<AppActionType>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = ({ language, auth }: InitialStateType, action: AppActionType) => ({
  language: languageReducer(language, action as LanguageActions),
  auth: authReducer(auth, action as AuthActions)
});

const AppProvider = ({ children }: PropsWithChildren) => {
  const initAuthInfo = getSavedAuthInfoFromLocalStorage() as LoginResponse | null;
  const [state, dispatch] = useReducer(mainReducer, {
    ...initialState,
    auth: {
      info: initAuthInfo,
      permissions: getUserPermissions(initAuthInfo?.role) || []
    }
  });
  const value = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
