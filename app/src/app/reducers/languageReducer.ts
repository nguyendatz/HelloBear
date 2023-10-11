import ActionMap from 'common/types/ActionMap';
import Language from 'common/types/Language';
import { appLang } from 'locales/i18n';

export enum LanguageActionTypes {
  LANGUAGE_SET = 'LANGUAGE_SET'
}

type LanguagePayload = {
  [LanguageActionTypes.LANGUAGE_SET]: keyof typeof appLang.languages;
};

export type LanguageActions = ActionMap<LanguagePayload>[keyof ActionMap<LanguagePayload>];

export const languageReducer = (state: Language, action: LanguageActions) => {
  switch (action.type) {
    case LanguageActionTypes.LANGUAGE_SET:
      return {
        ...state,
        lang: action.payload
      };
    default:
      return state;
  }
};
