import { PaginatedListOfUnitResponse } from 'apis/nswag';
import {
  ContentListQuery,
  IContentListState,
  IUnitInformationState,
  IUnitListState,
  PaginatedListOfContentListResponse,
  UnitListQuery
} from './types';
import { defaultUnitInformation } from './utils';

export enum UnitInformationStatus {
  Invited = 0,
  Actived = 1,
  Deactivated = 2
}

export interface UnitInformationResponse {
  textBookId?: number;
  number?: string;
  name?: string;
  phonics?: string;
  languageFocus?: string;
  description?: string;
}

type ContentListActionType =
  | { type: 'contentList.request' }
  | { type: 'contentList.loaded'; payload: PaginatedListOfContentListResponse }
  | { type: 'contentList.error'; payload: any }
  | { type: 'contentList.updateFilter'; payload: ContentListQuery }
  | { type: 'contentList.isSaving'; payload: boolean };

type UnitInformationActionType =
  | { type: 'unitInformation.request'; payload: boolean }
  | { type: 'unitInformation.loaded'; payload: UnitInformationResponse }
  | { type: 'unitInformation.isSaving'; payload: boolean }
  | { type: 'unitInformation.error'; payload: any };

export const initialContentListQuery: ContentListQuery = {
  pageNumber: 1,
  pageSize: 10,
  searchKey: '',
  sortCriteria: []
};

type UnitListActionType =
  | { type: 'unitList.request' }
  | { type: 'unitList.loaded'; payload: PaginatedListOfUnitResponse }
  | { type: 'unitList.isSaving'; payload: boolean }
  | { type: 'unitList.error'; payload: any }
  | { type: 'unitList.updateFilter'; payload: UnitListQuery };

export const initialUnitListQuery: UnitListQuery = {
  pageNumber: 1,
  pageSize: 10,
  searchKey: '',
  sortCriteria: []
};

export const initialContentListState: IContentListState = {
  isLoading: false,
  contentList: null,
  error: null,
  query: initialContentListQuery,
  isSaving: false
};

export const contentListReducer = (state: IContentListState, action: ContentListActionType): IContentListState => {
  switch (action.type) {
    case 'contentList.request':
      return { ...state, isLoading: true };
    case 'contentList.loaded':
      return { ...state, contentList: action.payload, isLoading: false };
    case 'contentList.error':
      return { ...state, contentList: null, isLoading: false, error: action.payload };
    case 'contentList.updateFilter':
      return { ...state, query: action.payload };
    case 'contentList.isSaving':
      return { ...state, isSaving: action.payload };
    default:
      throw new Error();
  }
};

export const initialUnitListState = {
  isLoading: true,
  userList: null,
  error: null,
  query: initialUnitListQuery
};

export const unitListReducer = (state: IUnitListState, action: UnitListActionType): IUnitListState => {
  switch (action.type) {
    case 'unitList.request':
      return { ...state, isLoading: true };
    case 'unitList.loaded':
      return { ...state, unitList: action.payload, isLoading: false };
    case 'unitList.error':
      return { ...state, unitList: null, isLoading: false, error: action.payload };
    case 'unitList.isSaving':
      return { ...state, isLoading: action.payload };
    case 'unitList.updateFilter':
      return { ...state, query: action.payload };
    default:
      throw new Error();
  }
};

export const initialUnitInformationState: IUnitInformationState = {
  itemDetail: { ...defaultUnitInformation },
  error: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  fieldGroups: [],
  query: initialUnitListQuery
};

export const unitInformationReducer = (
  state: IUnitInformationState,
  action: UnitInformationActionType
): IUnitInformationState => {
  switch (action.type) {
    case 'unitInformation.request':
      return { ...state, isLoading: true };
    case 'unitInformation.loaded':
      return {
        ...state,
        isLoading: false,
        itemDetail: { ...action.payload }
      };
    case 'unitInformation.error':
      return { ...state, isLoading: false, isSaving: false, error: action.payload };
    case 'unitInformation.isSaving':
      return { ...state, isLoading: action.payload };
    default:
      throw new Error();
  }
};
