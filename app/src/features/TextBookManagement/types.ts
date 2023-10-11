import { PaginatedListOfTextBookQueryResponse, SortCriteria, TextBookDetailResponse } from 'apis/nswag';
import { BasicQuery } from 'common/types/Queries';
import { ICommonItemDetailPage } from 'types/Common';

export type TextBookListQuery = BasicQuery;

export type TextBookListState = {
  textbooks: PaginatedListOfTextBookQueryResponse | null;
  isLoading: boolean;
  query: TextBookListQuery;
  error: string | null;
};

export interface ITextBookDetailState extends ICommonItemDetailPage<TextBookDetailResponse> {
  isDirty?: boolean;
}

export type UnitListQuery = BasicQuery & {
  sortCriteria?: SortCriteria[];
};

export interface TextBookDetailVM extends TextBookDetailResponse {
  thumbnailFile: File | null;
}
