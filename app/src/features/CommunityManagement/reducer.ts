import { CommunityActionType, CommunityQuery, ICommunityState } from './types';

export const communityReducer = (state: ICommunityState, action: CommunityActionType): ICommunityState => {
  switch (action.type) {
    case 'community.request':
      return { ...state, isLoading: true };
    case 'community.loaded':
      return { ...state, data: action.payload, isLoading: false };
    case 'community.loadedFilters':
      return { ...state, filters: action.payload, isLoading: false };
    case 'community.error':
      return { ...state, data: null, isLoading: false, error: action.payload };
    case 'community.isSaving':
      return { ...state, isLoading: action.payload };
    case 'community.updateFilter':
      return { ...state, query: action.payload };
    default:
      return { ...state };
  }
};

export const initialCommunityQuery: CommunityQuery = {
  classId: 0,
  unitId: 0,
  id: 0
};

export const initialCommunityState = {
  isLoading: true,
  data: null,
  filters: null,
  error: null,
  query: initialCommunityQuery
};
