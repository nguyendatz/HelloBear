import { StudentPushAndListenResponse } from 'apis/nswag';
import { RenderRectangles } from './types';

export const buildRenderRectangles = (
  rectangles: StudentPushAndListenResponse[],
  currentOffsetWidth: number,
  currentOffsetHeight: number
): RenderRectangles[] => {
  return rectangles.map((rect) => {
    const width = (rect.endX || 0) - (rect.startX || 0);
    const height = (rect.endY || 0) - (rect.startY || 0);
    return {
      ...rect,
      renderWidth: (currentOffsetWidth * width) / (rect.originalWidth || 0),
      renderHeight: (currentOffsetHeight * height) / (rect.originalHeight || 0),
      renderTop: (currentOffsetHeight * (rect.startY || 0)) / (rect.originalHeight || 0),
      renderLeft: (currentOffsetWidth * (rect.startX || 0)) / (rect.originalWidth || 0)
    };
  });
};

export const defaultContent = {
  name: '',
  url: ''
};
