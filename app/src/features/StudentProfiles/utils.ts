import i18n from 'i18next';
import * as Yup from 'yup';

export const MAXIMUM_PROFILES = 6;

export const createStudentValidationSchema = Yup.object({
  name: Yup.string().required(i18n.t('profile.validation.nameIsRequired'))
});

export const defaultCreateStudentValues = {
  name: '',
  hashCode: ''
};
