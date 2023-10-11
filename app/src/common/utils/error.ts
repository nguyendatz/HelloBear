/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from 'i18next';

import { statusCodes } from 'apis/https';

import { AxiosError } from 'axios';
import { showNotification } from './toastNotification';

export interface ResponseHandler {
  title: string;
  statusCode: number;
  detail: string;
  errors: object;
}

export const getErrorMessage = (responseJson: string): string => {
  try {
    const response = JSON.parse(responseJson) as ResponseHandler;
    return response.title;
  } catch (e) {
    return responseJson;
  }
};

export const showErrorNotificationMessage = (error: AxiosError) => {
  const { response } = error;
  const status = response?.status || undefined;
  let responseDataObject = response?.data as any;

  try {
    responseDataObject = JSON.parse(responseDataObject || response);
  } catch {}
  let messageKey = typeof responseDataObject === 'string' ? responseDataObject : responseDataObject?.title;

  if (status === statusCodes.status400BadRequest) {
    messageKey = messageKey || 'messages.badRequest';
    showNotification({
      message: i18n.t(messageKey),
      severity: 'error',
      autoHideDuration: 3000
    });
  } else if (status === statusCodes.status403Forbidden) {
    messageKey = messageKey || 'messages.forbidden';
    showNotification({
      message: i18n.t(messageKey),
      severity: 'error',
      autoHideDuration: 3000
    });
  } else if (status === statusCodes.status401Unauthorized) {
    messageKey = messageKey || 'messages.unauthorized';
    showNotification({
      message: i18n.t(messageKey),
      severity: 'error',
      autoHideDuration: 3000
    });
  } else if (status === statusCodes.status404NotFound) {
    messageKey = messageKey || 'messages.notFound';
    showNotification({
      message: i18n.t(messageKey),
      severity: 'error',
      autoHideDuration: 3000
    });
  } else if (status === statusCodes.status503ServiceUnavailable) {
    showNotification({
      message: i18n.t('messages.serviceUnavailable'),
      severity: 'error',
      autoHideDuration: 5000
    });
    window.setTimeout(() => {
      window.location.href = '/';
    }, 6000);
  } else if (status === statusCodes.status500InternalError) {
    messageKey = messageKey || responseDataObject?.detail || 'messages.internalError';
    showNotification({
      message: i18n.t(messageKey),
      severity: 'error',
      autoHideDuration: 5000
    });
  } else {
    messageKey = messageKey || responseDataObject?.detail || 'messages.internalError';
    showNotification({
      message: i18n.t(messageKey),
      severity: 'error',
      autoHideDuration: 5000
    });
  }
};
