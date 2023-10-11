import { StudentContentDetailResponse } from 'apis/nswag';
import { IContentState } from './types';
import { defaultContent } from './utils';

type ContentActionType =
  | { type: 'content.request' }
  | { type: 'content.loaded'; payload: StudentContentDetailResponse }
  | { type: 'content.error'; payload: any };

export const initialContentState = {
  itemDetail: { ...defaultContent },
  error: null,
  isLoading: false
};

export const contentReducer = (state: IContentState, action: ContentActionType): IContentState => {
  switch (action.type) {
    case 'content.request':
      return { ...state, isLoading: true };
    case 'content.loaded':
      return { ...state, isLoading: false, itemDetail: { ...action.payload } };
    case 'content.error':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error();
  }
};
