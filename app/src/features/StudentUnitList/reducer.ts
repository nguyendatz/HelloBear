import { UnitListActionType, UnitListQuery, IUnitListState } from './types';

export const unitListReducer = (state: IUnitListState, action: UnitListActionType): IUnitListState => {
  switch (action.type) {
    case 'unitList.request':
      return { ...state, isLoading: true };
    case 'unitList.loaded':
      return { ...state, data: action.payload, isLoading: false };
    case 'unitList.error':
      return { ...state, data: null, isLoading: false, error: action.payload };
    case 'unitList.isSaving':
      return { ...state, isLoading: action.payload };
    default:
      return { ...state };
  }
};

export const initialUnitListQuery: UnitListQuery = {
  classId: 0
};

export const initialUnitListState = {
  isLoading: true,
  data: null,
  filters: null,
  error: null,
  query: initialUnitListQuery
};
