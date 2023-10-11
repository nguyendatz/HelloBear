import { PushAndListenResponse } from 'apis/nswag';

export type PositionType = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type RenderRectangles = PushAndListenResponse & {
  renderWidth: number;
  renderHeight: number;
  renderTop: number;
  renderLeft: number;
};
