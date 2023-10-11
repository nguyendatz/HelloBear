import { ClassStatus, SortCriteria } from 'apis/nswag';
import { getEnumOptions } from 'common/utils/getEnumOptions';
import i18n from 'i18next';
import * as yup from 'yup';

export const ClassStatusEnumLabels = {
  [ClassStatus.Active]: 'Active',
  [ClassStatus.Inactive]: 'Inactive'
};

export const ClassStatusOptions = getEnumOptions(ClassStatusEnumLabels);

export const buildSortCriteria = (criteria: SortCriteria[]) => {
  const sortCriteriaForRequest = criteria.reduce((result: SortCriteria[], currentValue) => {
    if (currentValue.sortKey === 'mainTeacherName') {
      result.push(
        {
          sortKey: 'FirstName',
          isDescending: currentValue.isDescending
        },
        {
          sortKey: 'LastName',
          isDescending: currentValue.isDescending
        }
      );
    } else {
      result.push(currentValue);
    }

    return result;
  }, []);

  return sortCriteriaForRequest;
};

export const schemaValidationClass = yup.object().shape({
  className: yup.string().required(i18n.t('classManagement.validation.classNameIsRequired')),
  textBookId: yup.number().required(i18n.t('classManagement.validation.textBookIsRequired')),
  startDate: yup
    .date()
    .typeError(i18n.t('classManagement.validation.startDateIsRequired'))
    .required(i18n.t('classManagement.validation.startDateIsRequired')),
  endDate: yup
    .date()
    .typeError(i18n.t('classManagement.validation.endDateIsRequired'))
    .required(i18n.t('classManagement.validation.endDateIsRequired'))
    .min(yup.ref('startDate'), i18n.t('classManagement.validation.endDateGreaterThanStartDate'))
    .test('maxDate', i18n.t('classManagement.validation.limitEndDate'), function (value) {
      const { startDate } = this.parent;
      if (!startDate) {
        return true;
      }
      const twoYearsLater = new Date(startDate);
      twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
      return !value || value <= twoYearsLater;
    }),
  secondaryTeacherIds: yup.array().min(0).max(2, i18n.t('classManagement.validation.limitSecondaryTeachers'))
});

export const convertClassDateToUTC = (date: string) => {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate.toISOString();
};

export const buildClassCode = (
  mainTeacherShortName: string,
  textBookShortName: string,
  numberOfCreatedClasses: number,
  classOrder?: string
) => {
  if (!textBookShortName) return '';
  return `${textBookShortName}-${mainTeacherShortName}-${
    classOrder ? classOrder : (numberOfCreatedClasses + 1).toString().padStart(3, '0')
  }`;
};

export const hrefStyle = {
  marginLeft: '7px',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const
};

export const fieldSetStyle = {
  minWidth: 0,
  maxWidth: '100%',
  borderRadius: 4,
  padding: '0 6px 6px 6px',
  border: '1px solid #C9C9C9'
};
