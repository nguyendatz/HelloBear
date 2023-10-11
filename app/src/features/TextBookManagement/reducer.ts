import { PaginatedListOfTextBookQueryResponse, TextBookDetailResponse } from 'apis/nswag';
import { isEqualWith, isNull } from 'lodash';
import { ITextBookDetailState, TextBookListQuery, TextBookListState } from './types';
import { defaultTextBookDetail, textBookDetailFieldGroupsTemplate } from './utils';

type TextBookDetailActionType =
  | { type: 'textBookDetail.request' }
  | { type: 'textBookDetail.loaded'; payload: TextBookDetailResponse }
  | { type: 'textBookDetail.fileUploaded'; payload: string }
  | { type: 'textBookDetail.isSaving'; payload: boolean }
  | { type: 'textBookDetail.watchingFieldsChanged'; payload: TextBookDetailResponse }
  | { type: 'textBookDetail.error'; payload: any };
type TextBookListActionType =
  | { type: 'textBookList.loading' }
  | { type: 'textBookList.loaded'; payload: PaginatedListOfTextBookQueryResponse | null }
  | { type: 'textBookList.error'; payload?: any }
  | { type: 'textBookList.updateFilter'; payload: TextBookListQuery };
export const initialTextBookDetailState = (isEdit: boolean) => ({
  itemDetail: { ...defaultTextBookDetail },
  error: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  filePath: '',
  fieldGroups: textBookDetailFieldGroupsTemplate(isEdit)
});
export const initialTextBookQuery: TextBookListQuery = {
  pageSize: 10,
  pageNumber: 1,
  searchKey: '',
  sortCriteria: undefined
};

export const initialTextBookListState: TextBookListState = {
  textbooks: null,
  isLoading: false,
  query: initialTextBookQuery,
  error: null
};

export const textBookListReducer = (state: TextBookListState, action: TextBookListActionType): TextBookListState => {
  switch (action.type) {
    case 'textBookList.loading':
      return { ...state, isLoading: true };
    case 'textBookList.loaded':
      return { ...state, textbooks: action.payload, isLoading: false };
    case 'textBookList.error':
      return { ...state, textbooks: null, isLoading: false, error: action.payload };
    case 'textBookList.updateFilter':
      return { ...state, query: action.payload };
    default:
      return state;
  }
};
export const textBookDetailReducer = (
  state: ITextBookDetailState,
  action: TextBookDetailActionType
): ITextBookDetailState => {
  switch (action.type) {
    case 'textBookDetail.request':
      return { ...state, isLoading: true };
    case 'textBookDetail.loaded':
      return { ...state, isLoading: false, itemDetail: { ...action.payload } };
    case 'textBookDetail.error':
      return { ...state, isLoading: false, isSaving: false, error: action.payload };
    case 'textBookDetail.watchingFieldsChanged':
      return {
        ...state,
        isDirty: !isEqualWith(state.itemDetail, action.payload, (a, b) => {
          if ((isNull(a) || a === '') && (isNull(b) || b === '')) return true;
        })
      };
    case 'textBookDetail.isSaving':
      return { ...state, isLoading: action.payload };
    default:
      throw new Error();
  }
};
