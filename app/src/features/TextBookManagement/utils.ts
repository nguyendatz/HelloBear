import { MAX_FILE_SIZE, isValidFileType } from 'common/consts/file';
import i18n from 'i18next';
import * as Yup from 'yup';
import { TextBookDetailVM } from './types';

export const defaultTextBookDetail: TextBookDetailVM = {
  id: 0,
  name: '',
  shortName: '',
  thumbnail: '',
  description: '',
  thumbnailFile: null
};

export const textBookDetailValidationSchema = Yup.object({
  name: Yup.string().nullable().required(i18n.t('textBook.nameIsRequired')),
  shortName: Yup.string().nullable().required(i18n.t('textBook.shortNameIsRequired')),
  thumbnailFile: Yup.mixed()
    .nullable()
    .test(
      'isValidType',
      i18n.t('common.invalidFileType'),
      (value: any) => !value || isValidFileType(value.name.toLowerCase())
    )
    .test('isValidSize', i18n.t('common.invalidFileSize'), (value: any) => !value || value.size <= MAX_FILE_SIZE)
});

export const fieldsToWatch = ['thumbnailFile'];

export const textBookDetailFieldGroupsTemplate = (isEdit: boolean) => [
  {
    fields: [
      { name: 'name', type: 'text', label: 'name', required: true },
      {
        name: 'shortName',
        type: 'text',
        label: 'shortName',
        required: true,
        disabled: isEdit,
        inputProps: {
          maxLength: 3
        },
        regex: /^[a-zA-Z]$/
      },
      {
        name: 'description',
        type: 'text',
        label: 'description',
        multiline: true,
        rows: 3
      },
      {
        name: 'thumbnailFile',
        type: 'file',
        label: 'upload',
        helperText: 'Image file size limit 2MB.'
      },
      { name: 'thumbnail', type: 'image', width: 300, height: 300, selfLayout: { xs: 12 } }
    ],
    layout: { xs: 12, sm: 6 }
  }
];

export const unitListColumns = [
  {
    id: 'number',
    header: i18n.t('textBook.unitNumber'),
    accessorKey: 'number'
  },
  {
    id: 'name',
    header: i18n.t('textBook.unitName'),
    accessorKey: 'name'
  },
  {
    id: 'description',
    header: i18n.t('textBook.unitDescription'),
    accessorKey: 'description'
  }
];
