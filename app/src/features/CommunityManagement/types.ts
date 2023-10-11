import { CommunityResponse, LessonsByClassResponse } from 'apis/nswag';
import { ICommonPageState } from 'types/Common';

export type CommunityActionType =
  | { type: 'community.request' }
  | { type: 'community.loaded'; payload: CommunityResponse[] }
  | { type: 'community.loadedFilters'; payload: LessonsByClassResponse[] }
  | { type: 'community.isSaving'; payload: boolean }
  | { type: 'community.error'; payload: any }
  | { type: 'community.updateFilter'; payload: CommunityQuery };

export type CommunityQuery = {
  classId: number;
  unitId: number;
  id: number;
};

export interface ICommunityState extends ICommonPageState {
  data?: CommunityResponse[] | null;
  filters?: LessonsByClassResponse[] | null;
  query: CommunityQuery;
}

export enum EInteractionTypes {
  Like = 'Like',
  Heart = 'Heart'
}

export interface PropsCommunityManagement {
  getRandomColor?: () => string;
  increaseInteraction: (InteractionTypes: EInteractionTypes, id: number) => () => void;
  checkImageInteraction: (id: number, InteractionTypes: EInteractionTypes) => string;
  state: ICommunityState;
  id?: number;
  classId?: number;
  unitId?: number;
}

export enum EModeComponentTypes {
  Preview = 'preview',
  List = 'list'
}