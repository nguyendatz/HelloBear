import { StudentContentDetailResponse, StudentPushAndListenResponse } from 'apis/nswag';

export type RenderRectangles = StudentPushAndListenResponse & {
  renderWidth: number;
  renderHeight: number;
  renderTop: number;
  renderLeft: number;
};

export interface IContentState {
  itemDetail?: StudentContentDetailResponse;
  isLoading?: boolean;
  error?: any;
}