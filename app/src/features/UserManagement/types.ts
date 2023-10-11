import {
  PaginatedListOfRoleResponse,
  PaginatedListOfUserListResponse,
  SortCriteria,
  UserDetailResponse
} from 'apis/nswag';
import { BasicQuery } from 'common/types/Queries';
import { ICommonItemDetailPage, ICommonPageState } from 'types/Common';

export interface IUserListState extends ICommonPageState {
  userList?: PaginatedListOfUserListResponse | null;
  query: UserListQuery;
  isSaving: boolean;
}

export interface IUserDetailState extends ICommonItemDetailPage<UserDetailResponse> {
  isDirty?: boolean;
  roleList: PaginatedListOfRoleResponse;
}

export type UserListQuery = BasicQuery & {
  sortCriteria?: SortCriteria[];
};
