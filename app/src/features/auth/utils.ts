import { LoginResponse } from 'apis/nswag';
import { EmailRegex } from 'common/consts/regex';
import { getUnixTime } from 'date-fns';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import * as Yup from 'yup';

const loginInfoKey = 'loginInfo';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required('messages.emailRequire')
    .email('messages.invalidEmail')
    .matches(EmailRegex, 'messages.invalidEmail'),
  password: Yup.string().required('messages.passRequire')
});

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .required('messages.emailRequire')
    .email('messages.invalidEmail')
    .matches(EmailRegex, 'messages.invalidEmail')
});

export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string().required('messages.passRequire').min(8, 'messages.passMinLength'),
  confirmPassword: Yup.string()
    .required('messages.passRequire')
    .min(8, 'messages.passMinLength')
    .oneOf([Yup.ref('password')], 'messages.confirmPasswordField')
});

export const getSavedAuthInfoFromLocalStorage = () => {
  const loginInfo: LoginResponse =
    window.localStorage.getItem(loginInfoKey) && JSON.parse(window.localStorage.getItem(loginInfoKey) ?? '');

  return loginInfo
    ? {
        ...loginInfo
      }
    : null;
};

export const saveAuthInfoToLocalStorage = (data: LoginResponse) => {
  window.localStorage.setItem(loginInfoKey, JSON.stringify(data));
};

export const removeAuthInfoFromLocalStorage = () => {
  window.localStorage.removeItem(loginInfoKey);
};

export const isTokenExpired = (accessToken = '') => {
  if (!accessToken) return false;

  const { exp } = jwtDecode<JwtPayload>(accessToken);
  if (!exp) return false;

  const isExpired = exp < getUnixTime(new Date());

  return isExpired;
};

export const getTokenExp = (accessToken = '') => {
  if (!accessToken) return 0;

  const { exp } = jwtDecode<JwtPayload>(accessToken);
  if (!exp) return 0;

  return exp;
};
