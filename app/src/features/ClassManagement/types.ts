import { GetAllTeachersResponse, PaginatedListOfClassResponse, TextBookQueryResponse } from 'apis/nswag';
import { IOption } from 'common/types/IOption';
import { BasicQuery } from 'common/types/Queries';

export type TextbookOptions = { value: number; label: string };

export type ClassListQuery = BasicQuery & {
  status: string[] | null;
  teacherId: string | null;
};

export type ClassListState = {
  classes: PaginatedListOfClassResponse | null;
  isLoading: boolean;
  query: ClassListQuery;
  error: string | null;
  teacherOptions: GetAllTeachersResponse[] | null;
};

export type ClassDetailState = {
  isLoading: boolean;
  teacherOptions: IOption[] | null;
  textBookOptions: TextBookQueryResponse[] | null;
  searchText: {
    teachers: string;
    textbooks: string;
  };
  numberOfClassesCreated: number;
  classCode: string;
};
