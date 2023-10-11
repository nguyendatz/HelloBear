import { yupResolver } from '@hookform/resolvers/yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Button, FormHelperText, FormLabel, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { contentClient, unitClient } from 'apis';
import { ContentDetailResponse, ContentType } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import { showNotification } from 'common/utils/toastNotification';
import InputAutocompleteField from 'components/Inputs/InputAutocompleteField';
import PushAndListenContainer from 'features/PushAndListen/PushAndListenContainer';
import React, { useEffect, useReducer } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { contentDetailReducer, initialContentDetailState } from './reducer';
import { contentDetailValidationSchema, contentTypeContent, defaultContentDetail } from './utils';

export const ContentDetail = () => {
  const { t } = useTranslation();
  const { contentId, unitId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(contentId);
  const [state, dispatch] = useReducer(contentDetailReducer, initialContentDetailState);
  const { itemDetail } = state;

  const form = useForm({
    resolver: yupResolver(contentDetailValidationSchema),
    defaultValues: defaultContentDetail
  });

  const { handleSubmit, formState, control, reset } = form;
  const { field: textBookNameField, fieldState: textBookNameFieldState } = useController({
    name: 'textBookName',
    control
  });
  const { field: unitNameField, fieldState: unitNameFieldState } = useController({ name: 'lessonName', control });
  const { field: pageNumberField, fieldState: pageNumberFieldState } = useController({ name: 'pageNumber', control });
  const { field: nameField, fieldState: nameFieldState } = useController({
    name: 'name',
    control
  });
  const { field: descriptionField, fieldState: descriptionFieldState } = useController({
    name: 'description',
    control
  });
  const { field: FileField, fieldState: FileFieldState } = useController({
    name: 'pageImageFile',
    control
  });
  const { field: typeField } = useController({
    name: 'type',
    control
  });
  const { field: youtubeLinkField, fieldState: youtubeLinkFieldState } = useController({
    name: 'youtubeLink',
    control
  });
  const { field: wordwallNetLinkField, fieldState: wordwallNetLinkFieldState } = useController({
    name: 'wordwallNetLink',
    control
  });

  const onNavigate = () => {
    navigate(`/units/${unitId || itemDetail?.lessonId}`);
  };

  const onSubmit: SubmitHandler<ContentDetailResponse> = async (values) => {
    dispatch({ type: 'contentDetail.isSaving', payload: true });
    try {
      let filePath = '';
      if (FileField.value) {
        filePath = await contentClient.uploadPageImage({ data: FileField.value, fileName: FileField.value.name });
      }
      if (contentId) {
        await contentClient.update(Number(contentId), {
          ...values,
          lessonId: itemDetail?.lessonId,
          pageImage: filePath || itemDetail?.pageImage
        });
      } else {
        await contentClient.create({
          description: values.description,
          lessonId: Number(unitId),
          name: values.name,
          pageNumber: values.pageNumber,
          type: values.type,
          wordwallNetLink: values.wordwallNetLink,
          youtubeLink: values.youtubeLink,
          pageImage: filePath
        });
      }
      showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
      navigate(`/units/${contentId ? itemDetail?.lessonId : unitId}`);
    } catch (err: any) {
      dispatch({ type: 'contentDetail.error', payload: err });
    }

    dispatch({ type: 'contentDetail.isSaving', payload: false });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (contentId) {
          dispatch({ type: 'contentDetail.request', payload: true });
          const content = await contentClient.getContentDetail(Number(contentId));
          dispatch({ type: 'contentDetail.loaded', payload: content });
          reset(content);
        } else {
          const unit = await unitClient.getLessonById(Number(unitId));
          reset({
            textBookName: unit.textBookName,
            lessonName: unit.name
          });
        }
      } catch (err: any) {
        dispatch({ type: 'contentDetail.error', payload: err });
      }
    };

    getData();
  }, [contentId, dispatch, reset, unitId]);
  const isPushListenContent = Boolean(
    itemDetail?.pageImage && typeField.value && [ContentType.PushAndListen].includes(typeField.value)
  );
  return (
    <React.Fragment>
      <AdminPageLayout id="ContentDetail" title={isEdit ? t('content.detail') : t('content.create')}>
        <Box>
          <Grid container direction="row" spacing={2} alignItems={'flex-start'}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                error={Boolean(textBookNameFieldState.error)}
                helperText={t(textBookNameFieldState.error?.message || '')}
                name={textBookNameField.name}
                value={textBookNameField.value}
                onChange={textBookNameField.onChange}
                inputRef={textBookNameField.ref}
                disabled
                sx={{ m: 0 }}
                id="textBookName"
                label={t('content.textBookName')}
                autoComplete="textBookName"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                error={Boolean(unitNameFieldState.error)}
                helperText={t(unitNameFieldState.error?.message || '')}
                name={unitNameField.name}
                value={unitNameField.value}
                onChange={unitNameField.onChange}
                inputRef={unitNameField.ref}
                disabled
                sx={{ m: 0 }}
                id="unitName"
                label={t('content.unitName')}
                autoComplete="unitName"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                error={Boolean(nameFieldState.error)}
                helperText={t(nameFieldState.error?.message || '')}
                name={nameField.name}
                value={nameField.value}
                onChange={nameField.onChange}
                inputRef={nameField.ref}
                disabled={formState.isSubmitting}
                sx={{ m: 0 }}
                id="name"
                label={t('content.name')}
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputAutocompleteField
                name={typeField.name}
                label={t('content.type')}
                control={control}
                options={contentTypeContent}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                error={Boolean(pageNumberFieldState.error)}
                helperText={t(pageNumberFieldState.error?.message || '')}
                name={pageNumberField.name}
                value={pageNumberField.value}
                onChange={pageNumberField.onChange}
                inputRef={pageNumberField.ref}
                type="number"
                id="pageNumber"
                label={t('content.pageNumber')}
                autoComplete="pageNumber"
              />

              {typeField.value &&
                [ContentType.Read, ContentType.Music, ContentType.Video].includes(typeField.value) && (
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    error={Boolean(youtubeLinkFieldState.error)}
                    helperText={t(youtubeLinkFieldState.error?.message || '')}
                    name={youtubeLinkField.name}
                    value={youtubeLinkField.value}
                    onChange={youtubeLinkField.onChange}
                    inputRef={youtubeLinkField.ref}
                    disabled={formState.isSubmitting}
                    id="youtubeLink"
                    label={t('content.youtubeLink')}
                    autoComplete="youtubeLink"
                  />
                )}

              {typeField.value && [ContentType.Game].includes(typeField.value) && (
                <TextField
                  margin="normal"
                  fullWidth
                  required
                  error={Boolean(wordwallNetLinkFieldState.error)}
                  helperText={t(wordwallNetLinkFieldState.error?.message || '')}
                  name={wordwallNetLinkField.name}
                  value={wordwallNetLinkField.value}
                  onChange={wordwallNetLinkField.onChange}
                  inputRef={wordwallNetLinkField.ref}
                  disabled={formState.isSubmitting}
                  id="wordwallNetLink"
                  label={t('content.wordwallNetLink')}
                  autoComplete="wordwallNetLink"
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                fullWidth
                error={Boolean(descriptionFieldState.error)}
                helperText={t(descriptionFieldState.error?.message || '')}
                name={descriptionField.name}
                value={descriptionField.value}
                onChange={descriptionField.onChange}
                inputRef={descriptionField.ref}
                disabled={formState.isSubmitting}
                id="description"
                label={t('content.description')}
                autoComplete="description"
                multiline
                rows={4}
              />
              <FormLabel htmlFor={FileField.name}>
                <input
                  name={FileField.name}
                  id={FileField.name}
                  accept="image/*"
                  type="file"
                  ref={FileField.ref}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target?.files && e.target.files[0];

                    if (file) {
                      FileField?.onChange(file);
                    }
                  }}
                />
                <Button variant="contained" component="span" endIcon={<CloudUploadIcon />}>
                  {t('content.uploadPageImage')}
                </Button>{' '}
                <FormHelperText>{t('common.imageSizeLimit2Mb')}</FormHelperText>
                {FileFieldState.error ? (
                  <FormHelperText sx={{ color: 'red' }}>{FileFieldState.error?.message}</FormHelperText>
                ) : (
                  FileField?.value?.name
                )}
              </FormLabel>
            </Grid>
            {(FileField.value || itemDetail?.pageImage) && (
              <Grid item xs={12} sm={12}>
                <Box component="div" sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={FileField.value ? URL.createObjectURL(FileField.value) : itemDetail?.pageImage}
                    width={300}
                    height={300}
                    sx={{ objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}
          >
            <Button onClick={onNavigate} variant="outlined">
              {t('cancel')}
            </Button>

            <LoadingButton
              loading={formState.isSubmitting}
              loadingPosition="end"
              variant="contained"
              endIcon={<SaveIcon />}
              onClick={handleSubmit(onSubmit)}
            >
              {t('save')}
            </LoadingButton>
          </Box>
        </Box>
      </AdminPageLayout>
      {isPushListenContent && <PushAndListenContainer image={itemDetail?.pageImage ?? ''} />}
    </React.Fragment>
  );
};

export default ContentDetail;
