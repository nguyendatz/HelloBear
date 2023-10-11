import { PaginatedListOfUnitResponse, SortCriteria } from 'apis/nswag';
import { BasicQuery } from 'common/types/Queries';
import { ICommonItemDetailPage, ICommonPageState } from 'types/Common';
import { UnitInformationResponse } from './reducer';

export interface PaginatedListOfContentListResponse {
  items?: any[];
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface IContentListState extends ICommonPageState {
  contentList?: PaginatedListOfContentListResponse | null;
  query: ContentListQuery;
  isSaving: boolean;
}

export interface IUnitInformationState extends ICommonItemDetailPage<UnitInformationResponse> {
  isDirty?: boolean;
  query: UnitListQuery;
}

export type ContentListQuery = BasicQuery & {
  sortCriteria?: SortCriteria[];
  lessonId?: number;
};

export interface IUnitListState extends ICommonPageState {
  unitList?: PaginatedListOfUnitResponse | null;
  query: UnitListQuery;
}

export type UnitListQuery = BasicQuery & {
  sortCriteria?: SortCriteria[];
};
