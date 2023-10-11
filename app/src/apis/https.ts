import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showErrorNotificationMessage } from 'common/utils/error';
import { getSavedAuthInfoFromLocalStorage } from 'features/auth/utils';

const axiosInstance = axios.create({
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: (data) => data
});

declare module 'axios' {
  export interface AxiosInstance {
    ignoreError: boolean;
  }
}

export const statusCodes = {
  status503ServiceUnavailable: 503,
  status400BadRequest: 400,
  status401Unauthorized: 401,
  status403Forbidden: 403,
  status404NotFound: 404,
  status500InternalError: 500
};

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const savedAuthInfo = getSavedAuthInfoFromLocalStorage();
  if (savedAuthInfo?.accessToken) {
    config.headers.Authorization = `Bearer ${savedAuthInfo.accessToken}`;
  }
  if (config.data instanceof FormData) {
    config.headers.set('Content-Type', 'multipart/form-data');
  }
  return config;
};

axiosInstance.interceptors.request.use(requestInterceptor, (error) => error);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise(() => {});
    }

    const { response, request } = error as AxiosError;

    if (
      request.responseType === 'blob' &&
      response?.data instanceof Blob &&
      response?.data.type &&
      response?.data.type.toLowerCase().indexOf('json') !== -1
    ) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          response.data = JSON.parse(reader.result as string);
          resolve(Promise.reject(error));
        };

        reader.onerror = () => {
          reject(error);
        };

        reader.readAsText(response?.data as Blob);
      });
    }

    showErrorNotificationMessage(error);

    return Promise.reject(error);
  }
);

export const cancelToken = axios.CancelToken;

export default axiosInstance;
