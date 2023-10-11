import { PaginatedListOfRoleResponse, PhoneType, UserDetailResponse } from 'apis/nswag';
import { LandlineFormat, MobileFormat } from 'common/consts/regex';
import * as Yup from 'yup';

export const defaultUserDetail: UserDetailResponse = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  roleId: '',
  phoneNumber: '',
  phoneType: PhoneType.Landline
};

export const userDetailFieldGroupsTemplate = (
  isEdit: boolean,
  roleList: PaginatedListOfRoleResponse,
  phoneType: PhoneType
) => [
  {
    fields: [
      { name: 'firstName', type: 'text', label: 'firstName', required: true },
      { name: 'lastName', type: 'text', label: 'lastName', required: true },
      { name: 'email', type: 'text', label: 'email', required: true, disabled: isEdit },
      {
        name: 'roleId',
        type: 'select',
        label: 'role',
        required: true,
        data: roleList.items?.map((x) => ({
          id: x.id ?? '',
          name: x.name ?? ''
        }))
      },
      {
        name: 'phoneType',
        type: 'select',
        label: 'phoneType',
        regex: /^[\d-]+$/,
        data: Object.keys(PhoneType)
          .filter((v) => isNaN(Number(v)))
          .map((x) => ({
            id: PhoneType[x as keyof typeof PhoneType],
            name: x
          })),
        selfLayout: { xs: 12, sm: 2 }
      },
      {
        name: 'phoneNumber',
        type: 'phone',
        label: 'phoneNumber',
        format: phoneType === PhoneType.Landline ? LandlineFormat : MobileFormat,
        placeholder: phoneType === PhoneType.Landline ? 'e.g: 0123-45-6789' : 'e.g: 080-1234-5678',
        selfLayout: { xs: 12, sm: 4 }
      }
    ],
    layout: {
      xs: 12,
      sm: 6
    }
  }
];

export const userDetailValidationSchema = Yup.object({
  email: Yup.string().nullable().required('Email is required.').email('Invalid email format.'),
  firstName: Yup.string().nullable().required('First name is required.'),
  lastName: Yup.string().nullable().required('Last name is required.'),
  roleId: Yup.string().nullable().required('Role is required.'),
  phoneNumber: Yup.string().when('phoneType', {
    is: (val: PhoneType) => val === PhoneType.Landline,
    then: (schema) => schema.min(10, 'Invalid phone format.').max(10, 'Invalid phone format.'),
    otherwise: (schema) => schema.min(11, 'Invalid phone format.').max(11, 'Invalid phone format.')
  })
});

export const fieldsToWatch = ['firstName', 'lastName', 'email', 'roleId', 'phoneNumber', 'phoneType'];
