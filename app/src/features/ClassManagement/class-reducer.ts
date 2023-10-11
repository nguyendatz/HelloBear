import { GetAllTeachersResponse, PaginatedListOfClassResponse, TextBookQueryResponse } from 'apis/nswag';
import { IOption } from 'common/types/IOption';
import { ClassDetailState, ClassListQuery, ClassListState } from './types';

type ClassListActionType =
  | { type: 'classList.loading' }
  | { type: 'classList.loaded'; payload: PaginatedListOfClassResponse | null }
  | { type: 'classList.error'; payload?: any }
  | { type: 'classList.updateFilter'; payload: ClassListQuery }
  | { type: 'classList.loadTeacherOptions'; payload: GetAllTeachersResponse[] };

type ClassDetailActionType =
  | { type: 'classDetail.setLoading'; payload: boolean }
  | { type: 'classDetail.loadTeacherOptions'; payload: IOption[] }
  | { type: 'classDetail.loadTextbookOptions'; payload: TextBookQueryResponse[] }
  | { type: 'classDetail.loadNumberOfCreatedClasses'; payload: number }
  | { type: 'classDetail.loadClassCode'; payload: string };

export const initialClassQuery: ClassListQuery = {
  pageSize: 10,
  pageNumber: 1,
  searchKey: '',
  status: null,
  teacherId: null,
  sortCriteria: undefined
};
export const initialClassListState: ClassListState = {
  classes: null,
  isLoading: false,
  query: initialClassQuery,
  error: null,
  teacherOptions: null
};

export const classListReducer = (state: ClassListState, action: ClassListActionType): ClassListState => {
  switch (action.type) {
    case 'classList.loading':
      return { ...state, isLoading: true };
    case 'classList.loaded':
      return { ...state, classes: action.payload, isLoading: false };
    case 'classList.error':
      return { ...state, classes: null, isLoading: false, error: action.payload };
    case 'classList.updateFilter':
      return { ...state, query: action.payload };
    case 'classList.loadTeacherOptions':
      return { ...state, teacherOptions: action.payload };
    default:
      return state;
  }
};

export const initialClassDetailState: ClassDetailState = {
  isLoading: true,
  teacherOptions: null,
  textBookOptions: null,
  searchText: {
    teachers: '',
    textbooks: ''
  },
  numberOfClassesCreated: 0,
  classCode: ''
};

export const classDetailReducer = (state: ClassDetailState, action: ClassDetailActionType): ClassDetailState => {
  switch (action.type) {
    case 'classDetail.setLoading':
      return { ...state, isLoading: action.payload };
    case 'classDetail.loadTeacherOptions':
      return { ...state, teacherOptions: action.payload };
    case 'classDetail.loadTextbookOptions':
      return { ...state, textBookOptions: action.payload };
    case 'classDetail.loadNumberOfCreatedClasses':
      return { ...state, numberOfClassesCreated: action.payload };
    case 'classDetail.loadClassCode':
      return { ...state, classCode: action.payload };
    default:
      return state;
  }
};
