import { publish, subscribe, unsubscribe } from './eventEmitter';

export interface IToastMessage {
  id?: number;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  autoHideDuration?: number;
}

export const toastEventName = {
  open: 'toast.open',
  close: 'toast.close'
};

export const showNotification = (messagePayload: IToastMessage) => {
  publish(toastEventName.open, { id: new Date().getTime(), ...messagePayload });
};

export const subscribeNotification = (componentName: string, callback: (message: IToastMessage) => void) => {
  subscribe(componentName, toastEventName.open, callback);
};

export const unSubscribeNotification = (componentName: string) => {
  unsubscribe(componentName);
};
