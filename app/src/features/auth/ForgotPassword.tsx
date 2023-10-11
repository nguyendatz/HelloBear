import { yupResolver } from '@hookform/resolvers/yup';
import LockResetIcon from '@mui/icons-material/LockReset';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Avatar, Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { authClient } from 'apis';
import { ANONYMOUS_ROUTES } from 'app/AppRoutes';
import AuthPageLayout from 'app/layout/AuthPageLayout';
import { useCallback, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { forgotPasswordValidationSchema } from './utils';
export interface ForgotPasswordRequest {
  email: string;
}

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [loginEmail] = useLocalStorage('loginEmail', '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const defaultFormData = {
    email: loginEmail ?? ''
  };

  const form = useForm<ForgotPasswordRequest>({
    resolver: yupResolver(forgotPasswordValidationSchema),
    mode: 'onSubmit',
    defaultValues: defaultFormData
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting }
  } = form;

  const { field: emailField, fieldState: emailFieldState } = useController({ name: 'email', control });

  const onSubmit: SubmitHandler<ForgotPasswordRequest> = useCallback(
    async (data) => {
      try {
        const result = await authClient.forgotPassword(data as ForgotPasswordRequest);
        if (result) {
          reset();
          setIsSubmitted(true);
        }
      } catch (error: any) {
        setIsSubmitted(false);
      }
    },
    [reset]
  );

  const returnToLogin = () => {
    navigate(`/${ANONYMOUS_ROUTES.Login.path}`);
  };

  return (
    <AuthPageLayout id='forgotPassword'>
      { isSubmitted ? (
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <MarkEmailUnreadIcon />
        </Avatar>
        <Typography variant="h3">{t('forgotPassword.requestSent')}</Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h5">{t('forgotPassword.confirm')}</Typography>
          <Grid item sx={{ textAlign: 'left', pt: '8px !important' }}></Grid>
          <Button
            type="button"
            variant="contained"
            onClick={returnToLogin}
            fullWidth
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('forgotPassword.returnToLogin')}
          </Button>
        </Box>
      </Box>
    ) : (
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h3">
          {t('forgotPassword.title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} id="forgot-pwd-form" noValidate sx={{ mt: 1 }}>
          <Typography variant="h5">{t('forgotPassword.guide')}</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(emailFieldState.error)}
            helperText={t(emailFieldState.error?.message || '')}
            name={emailField.name}
            value={emailField.value}
            onChange={emailField.onChange}
            inputRef={emailField.ref}
            disabled={isSubmitting}
            id="email"
            label={t('forgotPassword.email')}
            autoComplete="email"
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            color="secondary"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('forgotPassword.resetPassword')}
          </Button>
        </Box>
      </Box>
    )}
    </AuthPageLayout>
  )
}
