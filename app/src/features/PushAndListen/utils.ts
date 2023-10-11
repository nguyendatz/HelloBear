import { PushAndListenResponse } from 'apis/nswag';
import { MAX_FILE_SIZE, isValidFileType } from 'common/consts/file';
import i18n from 'i18next';
import * as Yup from 'yup';
import { RenderRectangles } from './types';

export const defaultImageValue: {
  imagePath: string;
} = {
  imagePath: ''
};

export const imageValidationSchema = Yup.object({
  imagePath: Yup.mixed()
    .nullable()
    .test(
      'isValidType',
      i18n.t('common.invalidFileType'),
      (value: any) => !value || isValidFileType(value.name.toLowerCase())
    )
    .test('isValidSize', i18n.t('common.invalidFileSize'), (value: any) => !value || value.size <= MAX_FILE_SIZE)
});

export const defaultRectangleValue: {
  name: string;
  audioFileUrl: string;
} = {
  name: '',
  audioFileUrl: ''
};

export const rectangleValidationSchema = Yup.object({
  name: Yup.string().required(i18n.t('pushListen.validation.name')),
  audioFileUrl: Yup.string().required(i18n.t('pushListen.validation.audioUrl'))
});

export const buildRenderRectangles = (
  rectangles: PushAndListenResponse[],
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
