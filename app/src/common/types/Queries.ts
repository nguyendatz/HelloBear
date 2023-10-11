import { SortCriteria } from 'apis/nswag';

export type BasicQuery = {
  pageNumber: number;
  pageSize: number;
  searchKey: string;
  sortCriteria?: SortCriteria[];
};
