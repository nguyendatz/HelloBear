import * as Yup from 'yup';
import { UnitInformationResponse } from './reducer';

export const defaultUnitInformation: UnitInformationResponse = {
  textBookId: 0,
  number: '',
  name: '',
  languageFocus: '',
  description: '',
  phonics: ''
};

export const unitInformationValidationSchema = Yup.object({
  name: Yup.string().nullable().required('Name is required.'),
  number: Yup.string().nullable().required('Number is required.'),
  languageFocus: Yup.string().nullable().required('Language Focus is required.'),
  phonics: Yup.string().nullable().required('Phonics is required.')
});

export const fieldsToWatch = ['number', 'name', 'description', 'languageFocus', 'phonics'];
