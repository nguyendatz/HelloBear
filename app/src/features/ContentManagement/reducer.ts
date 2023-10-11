import { ContentDetailResponse } from 'apis/nswag';
import { defaultContentDetail } from './utils';
import { IContentItemDetailPage } from './types';

type ContentDetailActionType =
  | { type: 'contentDetail.request'; payload: boolean }
  | { type: 'contentDetail.loaded'; payload: ContentDetailResponse }
  | { type: 'contentDetail.isSaving'; payload: boolean }
  | { type: 'contentDetail.error'; payload: any };

export const initialContentDetailState: IContentItemDetailPage<ContentDetailResponse> = {
  itemDetail: { ...defaultContentDetail },
  error: null,
  isLoading: false,
  isSaving: false
};

export const contentDetailReducer = (
  state: IContentItemDetailPage<ContentDetailResponse>,
  action: ContentDetailActionType
): IContentItemDetailPage<ContentDetailResponse> => {
  switch (action.type) {
    case 'contentDetail.request':
      return { ...state, isLoading: true };
    case 'contentDetail.loaded':
      return {
        ...state,
        isLoading: false,
        itemDetail: { ...action.payload }
      };
    case 'contentDetail.error':
      return { ...state, isLoading: false, isSaving: false, error: action.payload };
    case 'contentDetail.isSaving':
      return { ...state, isLoading: action.payload };
    default:
      return { ...state };
  }
};
