import { LessonsByClassResponse } from 'apis/nswag';
import { ICommonPageState } from 'types/Common';

export type UnitListActionType =
  | { type: 'unitList.request' }
  | { type: 'unitList.loaded'; payload: LessonsByClassResponse[] }
  | { type: 'unitList.isSaving'; payload: boolean }
  | { type: 'unitList.error'; payload: any };

export type UnitListQuery = {
  classId: number;
};

export interface IUnitListState extends ICommonPageState {
  data?: LessonsByClassResponse[] | null;
  query: UnitListQuery;
}