import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { authClient } from 'apis';
import { useAppContext } from 'app/AppContext';
import { ADMIN_APP_ROUTES, ANONYMOUS_ROUTES } from 'app/AppRoutes';
import AuthPageLayout from 'app/layout/AuthPageLayout';
import { useCallback, useState } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { AuthActionTypes } from './login-reducer';
import { isTokenExpired, loginValidationSchema } from './utils';

export interface LoginRequest {
  email: string;
  password: string;
  isRemember: boolean;
}

export default function Login() {
  const { t } = useTranslation();
  const [loginEmail, setLoginEmail] = useLocalStorage('loginEmail', '');
  const [isRemember, setIsRemember] = useLocalStorage('isRemember', false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    dispatch,
    state: {
      auth: { info: authInfo }
    }
  } = useAppContext();

  const isValidLoginInfo = authInfo?.accessToken && !isTokenExpired(authInfo?.accessToken);

  const defaultValues: LoginRequest = {
    email: loginEmail ?? '',
    password: '',
    isRemember: isRemember ?? false
  };

  const form = useForm<LoginRequest>({
    defaultValues: defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(loginValidationSchema)
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { isSubmitting }
  } = form;

  const { field: emailField, fieldState: emailFieldState } = useController({ name: 'email', control });
  const { field: passwordField, fieldState: passwordFieldState } = useController({
    name: 'password',
    control
  });

  const onSubmit: SubmitHandler<LoginRequest> = useCallback(
    async (data: LoginRequest) => {
      try {
        const loginResult = await authClient.login(data);
        dispatch({ type: AuthActionTypes.AUTH_INFO_SET, payload: loginResult });
        navigate(`/${ADMIN_APP_ROUTES.ClassManagement.path}`);
      } catch (error: any) {}
    },
    [dispatch, navigate]
  );

  const navigateToForgotPasswordPage = () => {
    navigate(`/${ANONYMOUS_ROUTES.ForgotPassword.path}`);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isStatusHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('isRemember', event.target.checked, { shouldDirty: false });
    setLoginEmail(event.target.checked ? getValues().email : '');
    setIsRemember(event.target.checked);
  };

  if (isValidLoginInfo) {
    // TODO: need to specify the default page
    const defaultPage = `/${ADMIN_APP_ROUTES.ClassManagement.path}`;
    return <Navigate to={defaultPage} replace />;
  }

  return (
    <AuthPageLayout id='login' >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h3">
          {t('login.title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} id="login-form" noValidate sx={{ mt: 1 }}>
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
            label={t('login.email')}
            autoComplete="email"
          />
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
            label={t('login.password')}
            id="password"
            autoComplete="current-password"
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
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                onChange={isStatusHandleChange}
                checked={defaultValues.isRemember}
              />
            }
            label={t('login.rememberMe')}
          />
          <Button
            type="submit"
            color="secondary"
            disabled={isSubmitting}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('login.signIn')}
          </Button>
          <Grid
            container
            sx={{
              justifyContent: 'space-between',
              pr: 1
            }}
          >
            <Button
              variant="text"
              color="secondary"
              sx={{ fontWeight: 400, fontSize: 16 }}
              onClick={navigateToForgotPasswordPage}
            >
              {t('login.forgotPassword')}
            </Button>
          </Grid>
        </Box>
      </Box>
    </AuthPageLayout>
  );
}
