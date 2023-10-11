import { IFieldGroupTemplate } from './FormGenerator';

export interface ICommonPageState {
  isLoading: boolean;
  error?: string | null;
}

export interface ICommonReadItemDetailPage<TItem> extends ICommonPageState {
  itemDetail?: TItem;
}

export interface ICommonItemDetailPage<TItem> extends ICommonReadItemDetailPage<TItem> {
  fieldGroups: IFieldGroupTemplate[];
  isSaving?: boolean;
}

export interface QueryResults<TData> {
  resultCount: number;
  pageNumber: number;
  items: TData[];
}

export interface FilterSelectOption {
  value: number | string;
  label: string;
}
