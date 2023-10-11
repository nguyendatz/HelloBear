import { ContentType } from 'apis/nswag';
import { MAX_FILE_SIZE, isValidFileType } from 'common/consts/file';
import i18next from 'i18next';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import { ContentDetailValues, EContentText } from './types';

export const defaultContentDetail: ContentDetailValues = {
  id: 0,
  textBookName: '',
  lessonName: '',
  pageNumber: 0,
  name: '',
  description: '',
  pageImage: '',
  type: 1,
  youtubeLink: '',
  wordwallNetLink: '',
  pageImageFile: undefined
};

export const contentTypeContent: { value: ContentType; label: string }[] = [
  {
    value: ContentType.Read,
    label: EContentText.Read
  },
  {
    value: ContentType.Music,
    label: EContentText.Music
  },
  {
    value: ContentType.Video,
    label: EContentText.Video
  },
  {
    value: ContentType.Game,
    label: EContentText.Game
  },
  {
    value: ContentType.PushAndListen,
    label: EContentText.PushAndListen
  },
  {
    value: ContentType.Record,
    label: EContentText.Record
  }
];

export const contentDetailValidationSchema = Yup.object({
  pageNumber: Yup.number()
    .typeError('Page number must be a number.')
    .min(1, 'Page number must be greater than or equal to 1.')
    .required('Page number is required.'),
  name: Yup.string().required('Content Name is required.'),
  youtubeLink: Yup.string().test('youtubeLink', 'Youtube Link is required.', function (value) {
    const { type } = this.parent;
    const isValidate = [ContentType.Read, ContentType.Music, ContentType.Video].includes(type || 0);
    return !isEmpty(value) || !isValidate;
  }),
  wordwallNetLink: Yup.string().test('wordwallNetLink', 'Wordwall Net Link is required.', function (value) {
    const { type } = this.parent;
    const isValidate = type === ContentType.Game;
    return !isEmpty(value) || !isValidate;
  }),
  pageImageFile: Yup.mixed()
    .nullable()
    .when('pageImage', {
      is: '' || undefined,
      then: (d) => d.required('Page Image is required.')
    })
    .test(
      'isValidType',
      i18next.t('common.invalidFileType'),
      (value: any) => !value || isValidFileType(value.name.toLowerCase())
    )
    .test(
      'isValidSize',
      i18next.t('common.fileIsTooBig'),
      (value: any) => !value || value.size <= MAX_FILE_SIZE
    )
});
