import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import PasswordIcon from '@mui/icons-material/Password';
import { IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { authClient } from 'apis';
import { UpdatePasswordCommand } from 'apis/nswag';
import { useAppContext } from 'app/AppContext';
import { ANONYMOUS_ROUTES } from 'app/AppRoutes';
import AuthPageLayout from 'app/layout/AuthPageLayout';
import { AuthActionTypes } from 'features/auth/login-reducer';
import { useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordValidationSchema } from './utils';
export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export default function Login() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const purpose = searchParams.get('purpose');

  const defaultValues: ResetPasswordRequest = {
    password: '',
    confirmPassword: ''
  };

  const { dispatch } = useAppContext();

  const form = useForm<ResetPasswordRequest>({
    defaultValues: defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(resetPasswordValidationSchema)
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = form;

  const { field: passwordField, fieldState: passwordFieldState } = useController({ name: 'password', control });
  const { field: confirmPasswordField, fieldState: confirmPasswordFieldState } = useController({
    name: 'confirmPassword',
    control
  });

  const onSubmit: SubmitHandler<ResetPasswordRequest> = async (data: ResetPasswordRequest) => {
    try {
      const { password } = data;
      const request: UpdatePasswordCommand = {
        token: token || '',
        userId: userId || '',
        purpose: purpose || '',
        password: password || ''
      };
      const resetPassword = await authClient.updatePassword(request);
      if (resetPassword) {
        setIsSubmitted(true);
        dispatch({ type: AuthActionTypes.AUTH_LOG_OUT });
      }
    } catch (error: any) {}
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const returnToLogin = () => {
    navigate(`/${ANONYMOUS_ROUTES.Login.path}`);
  };

  return (
    <AuthPageLayout id='resetPassword' >
      {isSubmitted ? (
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <MarkEmailReadIcon />
        </Avatar>
        <Typography component="h1" variant="h3">
          {t('resetPassword.passwordUpdated')}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography component="h1" variant="h5">
            {t('resetPassword.confirm')}
          </Typography>
          <Button
            type="button"
            variant="contained"
            onClick={returnToLogin}
            fullWidth
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('resetPassword.goToLogin')}
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
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h3">
          {t('resetPassword.title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} id="reset-password-form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(passwordFieldState.error)}
            helperText={t(passwordFieldState.error?.message || '')}
            name={passwordField.name}
            value={passwordField.value}
            onChange={passwordField.onChange}
            inputRef={passwordField.ref}
            disabled={isSubmitting}
            label={t('resetPassword.password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(confirmPasswordFieldState.error)}
            helperText={t(confirmPasswordFieldState.error?.message || '')}
            name={confirmPasswordField.name}
            value={confirmPasswordField.value}
            onChange={confirmPasswordField.onChange}
            inputRef={confirmPasswordField.ref}
            disabled={isSubmitting}
            label={t('resetPassword.confirmPassword')}
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            color="secondary"
            disabled={isSubmitting}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('resetPassword.updatePassword')}
          </Button>
        </Box>
      </Box>
    )}
    </AuthPageLayout>
  )
}
