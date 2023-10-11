import { yupResolver } from '@hookform/resolvers/yup';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, TextField } from '@mui/material';
import { classClient, textBookClient, userClient } from 'apis';
import { ClassBodyRequest, ClassDetailResponse, ClassStatus, LessonsByClassResponse } from 'apis/nswag';
import { useAppContext } from 'app/AppContext';
import { Roles, roleKeys } from 'common/consts/roles';
import InputAutocompleteField from 'components/Inputs/InputAutocompleteField';
import InputDatePickerField from 'components/Inputs/InputDatePickerField';
import InputSelectField from 'components/Inputs/InputSelectField';
import InputTextField from 'components/Inputs/InputTextField';
import { addYears } from 'date-fns';
import { useAccessControl } from 'features/auth/access-control';
import React, { useEffect, useReducer, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { classDetailReducer, initialClassDetailState } from '../class-reducer';
import {
  ClassStatusOptions,
  buildClassCode,
  convertClassDateToUTC,
  fieldSetStyle,
  hrefStyle,
  schemaValidationClass
} from '../utils';
interface IProps {
  classInfo?: ClassDetailResponse & { communityClassList: LessonsByClassResponse[] };
  onClose: (isDirty?: boolean) => void;
  onSubmit: (formValue: ClassBodyRequest) => void;
}

const ClassForm = ({ classInfo, onClose, onSubmit }: IProps) => {
  const {
    state: {
      auth: { info }
    }
  } = useAppContext();
  const { t } = useTranslation(['common']);
  const { isPermitted: isWritable } = useAccessControl({ defaultAllowedRoles: [Roles.Administrator] });
  const [state, dispatch] = useReducer(classDetailReducer, initialClassDetailState);
  const { isLoading, textBookOptions, teacherOptions, numberOfClassesCreated, classCode } = state;

  const communityLink = useMemo(() => {
    if (classInfo?.communityClassList) {
      return `${window.location.origin}/student/community/list?classId=${classInfo?.id}&unitId=${classInfo?.communityClassList?.[0]?.id}`;
    }
    return '#';
  }, [classInfo]);

  const defaultValues: ClassBodyRequest = {
    className: '',
    textBookId: undefined,
    mainTeacherId: info?.id,
    mainTeacherShortName: `${info?.firstName?.charAt(0)}${info?.lastName?.charAt(0)}`,
    textBookShortName: '',
    startDate: new Date().toString(),
    endDate: addYears(new Date(), 1).toString(),
    status: ClassStatus.Active,
    secondaryTeacherIds: []
  };
  const methods = useForm<ClassBodyRequest>({
    resolver: yupResolver(schemaValidationClass),
    defaultValues
  });
  const { handleSubmit, formState, control, reset } = methods;
  const watchTextbookChanged = useWatch({ name: 'textBookId', control });
  const submit = async (data: ClassBodyRequest) => {
    onSubmit({
      ...data,
      startDate: convertClassDateToUTC(data.startDate ?? ''),
      endDate: convertClassDateToUTC(data.endDate ?? ''),
      textBookShortName: (textBookOptions || []).find((o) => o.id === data.textBookId)?.shortName ?? ''
    });
  };
  const onCloseForm = () => {
    onClose(formState.isDirty);
  };
  useEffect(() => {
    const loadTeacherOptions = async () => {
      const queryUsers = await userClient.getUsersWithPagination([roleKeys.Teacher], undefined, 1, 100);
      const teacherOptions = (queryUsers.items || []).map((u) => ({
        value: u.id ?? '',
        label: u.fullName ?? ''
      }));
      dispatch({
        type: 'classDetail.loadTeacherOptions',
        payload: teacherOptions
      });
    };
    loadTeacherOptions();
  }, [info?.id]);
  useEffect(() => {
    const loadTextBookOptions = async () => {
      const queryTextBooks = await textBookClient.getAllTextBooks();
      const textBookOptions = queryTextBooks || [];
      dispatch({
        type: 'classDetail.loadTextbookOptions',
        payload: textBookOptions
      });
    };
    loadTextBookOptions();
  }, []);
  useEffect(() => {
    if (teacherOptions && textBookOptions) {
      dispatch({
        type: 'classDetail.setLoading',
        payload: false
      });
    }
  }, [teacherOptions, textBookOptions]);
  useEffect(() => {
    if (!classInfo) return;
    reset({
      className: classInfo?.className,
      textBookId: classInfo?.textBookId,
      mainTeacherId: classInfo?.mainTeacherId,
      startDate: classInfo?.startDate ?? '',
      endDate: classInfo?.endDate ?? '',
      status: classInfo?.status,
      secondaryTeacherIds: classInfo?.secondaryTeacherIds
    });
    dispatch({
      type: 'classDetail.loadClassCode',
      payload: classInfo.classCode ?? ''
    });
  }, [classInfo, reset]);
  useEffect(() => {
    const getClasses = async () => {
      const numberOfCreatedClasses = await classClient.getCreatedClassesByTeacherId(info?.id ?? '');
      dispatch({ type: 'classDetail.loadNumberOfCreatedClasses', payload: numberOfCreatedClasses });
    };
    getClasses();
  }, [info?.id]);
  useEffect(() => {
    if (!info) return;
    const { firstName, lastName } = info;
    const textBookShortName = (textBookOptions || []).find((o) => o.id === watchTextbookChanged)?.shortName ?? '';
    const mainTeacherShortName = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;
    const classCode = buildClassCode(
      mainTeacherShortName,
      textBookShortName,
      numberOfClassesCreated,
      classInfo ? classInfo.classCode?.split('-')[2] : undefined
    );
    dispatch({
      type: 'classDetail.loadClassCode',
      payload: classCode
    });
  }, [watchTextbookChanged, textBookOptions, info, numberOfClassesCreated, classInfo]);
  if (isLoading) return <></>;
  return (
    <Box>
      <Box component="form" id="class-form" noValidate autoComplete="off">
        <Grid container columnSpacing={2} rowSpacing={4}>
          <Grid item xs={12} md={6}>
            <TextField name="classCode" value={classCode} label={t('classManagement.classCode')} disabled fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="mainTeacher"
              value={classInfo ? classInfo.mainTeacherFullName : `${info?.firstName} ${info?.lastName}`}
              label={t('classManagement.mainTeacher')}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputSelectField
              name="status"
              label={t('classManagement.classStatus')}
              control={control}
              options={ClassStatusOptions.map((option) => ({ ...option, value: +option.value }))}
              disabled={!isWritable}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputAutocompleteField
              name="secondaryTeacherIds"
              control={control}
              label={t('classManagement.secondaryTeachers')}
              options={teacherOptions}
              multiple
              disabled={!isWritable}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputTextField
              name="className"
              control={control}
              label={t('classManagement.className')}
              required
              disabled={!isWritable}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputDatePickerField
              name="startDate"
              control={control}
              label={t('classManagement.schoolYearStartDate')}
              fullWidth
              minDate={new Date()}
              views={['month', 'year']}
              required
              disabled={!isWritable}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputAutocompleteField
              name="textBookId"
              label={t('classManagement.textbook')}
              control={control}
              options={textBookOptions}
              valueFieldName="id"
              labelFieldName="name"
              disabled={!isWritable}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputDatePickerField
              name="endDate"
              control={control}
              label={t('classManagement.schoolYearEndDate')}
              fullWidth
              minDate={new Date()}
              views={['month', 'year']}
              required
              disabled={!isWritable}
            />
          </Grid>
          {classInfo && (
            <React.Fragment>
              <Grid item xs={12} md={6}>
                <fieldset style={fieldSetStyle}>
                  <legend
                    style={{
                      fontSize: 14,
                      marginLeft: 7
                    }}
                  >
                    {t('classManagement.communityLink')}
                  </legend>
                  <a
                    href={communityLink}
                    target="_blank"
                    rel="noreferrer"
                    style={hrefStyle}
                  >
                    {communityLink}
                  </a>
                </fieldset>
              </Grid>
              <Grid item xs={12} md={6}>
                <fieldset style={fieldSetStyle}>
                  <legend
                    style={{
                      fontSize: 14,
                      marginLeft: 7
                    }}
                  >
                    {t('classManagement.urlLink')}
                  </legend>
                  <a href={classInfo?.hashUrl} target="_blank" rel="noreferrer" style={hrefStyle}>
                    {classInfo?.hashUrl}
                  </a>
                </fieldset>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Box
                  component="img"
                  src={classInfo?.qrCodePath}
                  alt="QRCode"
                  sx={{
                    width: 150,
                    height: 150,
                    cursor: 'pointer'
                  }}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Box>
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}
      >
        <LoadingButton
          loading={formState.isSubmitting}
          loadingPosition="end"
          variant="contained"
          endIcon={<SaveIcon />}
          onClick={handleSubmit(submit)}
          disabled={!isWritable}
        >
          {t('save')}
        </LoadingButton>
        <Button onClick={onCloseForm} variant="outlined">
          {t('cancel')}
        </Button>
      </Box>
    </Box>
  );
};

export default ClassForm;
