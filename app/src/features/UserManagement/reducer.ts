import {
  PaginatedListOfRoleResponse,
  PaginatedListOfUserListResponse,
  PhoneType,
  UserDetailResponse
} from 'apis/nswag';
import { isEqualWith, isNull } from 'lodash';
import { IUserDetailState, IUserListState, UserListQuery } from './types';
import { defaultUserDetail, userDetailFieldGroupsTemplate } from './utils';

type UserListActionType =
  | { type: 'userList.request' }
  | { type: 'userList.loaded'; payload: PaginatedListOfUserListResponse }
  | { type: 'userList.error'; payload: any }
  | { type: 'userList.updateFilter'; payload: UserListQuery }
  | { type: 'userList.isSaving'; payload: boolean };

type UserDetailActionType =
  | { type: 'userDetail.request'; payload: boolean }
  | { type: 'userDetail.loaded'; payload: UserDetailResponse }
  | { type: 'userDetail.rolesLoaded'; payload: PaginatedListOfRoleResponse }
  | { type: 'userDetail.isSaving'; payload: boolean }
  | { type: 'userDetail.watchingFieldsChanged'; payload: UserDetailResponse }
  | { type: 'userDetail.phoneTypeChanged'; payload: PhoneType }
  | { type: 'userDetail.error'; payload: any };

export const initialUserListQuery: UserListQuery = {
  pageNumber: 1,
  pageSize: 10,
  searchKey: '',
  sortCriteria: []
};

export const initialUserListState: IUserListState = {
  isLoading: false,
  userList: null,
  error: null,
  query: initialUserListQuery,
  isSaving: false
};

export const userListReducer = (state: IUserListState, action: UserListActionType): IUserListState => {
  switch (action.type) {
    case 'userList.request':
      return { ...state, isLoading: true };
    case 'userList.loaded':
      return { ...state, userList: action.payload, isLoading: false };
    case 'userList.error':
      return { ...state, userList: null, isLoading: false, error: action.payload };
    case 'userList.updateFilter':
      return { ...state, query: action.payload };
    case 'userList.isSaving':
      return { ...state, isSaving: action.payload };
    default:
      throw new Error();
  }
};

export const initialUserDetailState: IUserDetailState = {
  itemDetail: { ...defaultUserDetail },
  error: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  fieldGroups: [],
  roleList: {}
};

export const userDetailReducer =
  (isEdit: boolean) =>
  (state: IUserDetailState, action: UserDetailActionType): IUserDetailState => {
    switch (action.type) {
      case 'userDetail.request':
        return { ...state, isLoading: true };
      case 'userDetail.loaded':
        return {
          ...state,
          isLoading: false,
          itemDetail: { ...action.payload }
        };
      case 'userDetail.rolesLoaded':
        return {
          ...state,
          roleList: action.payload,
          fieldGroups: [
            ...userDetailFieldGroupsTemplate(isEdit, action.payload, state.itemDetail?.phoneType ?? PhoneType.Landline)
          ]
        };
      case 'userDetail.error':
        return { ...state, isLoading: false, isSaving: false, error: action.payload };
      case 'userDetail.watchingFieldsChanged':
        return {
          ...state,
          isDirty: !isEqualWith(state.itemDetail, action.payload, (a, b) => {
            if ((isNull(a) || a === '') && (isNull(b) || b === '')) return true;
          })
        };
      case 'userDetail.phoneTypeChanged':
        return {
          ...state,
          fieldGroups: [...userDetailFieldGroupsTemplate(isEdit, state.roleList, action.payload)]
        };
      case 'userDetail.isSaving':
        return { ...state, isLoading: action.payload };
      default:
        throw new Error();
    }
  };
