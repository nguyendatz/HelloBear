import { EventEmitter, EventSubscription } from 'fbemitter';

interface ISubscriber {
  subscriber: unknown;
  subscription: EventSubscription;
}

const emitter = new EventEmitter();
let subscribers: Array<ISubscriber> = [];

export const publish = (eventName: string, message: unknown) => {
  emitter.emit(eventName, message);
};

export const subscribeToEvent = (eventName: string, callback: (message: any) => void) =>
  emitter.addListener(eventName, callback);

export const unsubscribeWithSubscription = (subscription: EventSubscription) => {
  if (subscription) {
    subscription.remove();
  }
};

export const subscribe = (subscriber: unknown, eventName: string, callback: (message: any) => void) => {
  const subscription = subscribeToEvent(eventName, callback);

  subscribers.push({
    subscriber,
    subscription
  });

  publish('eventbus.addedListener', {
    listeners: emitter.listeners.length
  });
};

export const unsubscribe = (subscriber: unknown) => {
  const listeners = subscribers.filter((x) => x.subscriber === subscriber);

  subscribers = subscribers.filter((x: { subscriber: unknown }) => x.subscriber !== subscriber);

  listeners.forEach((x) => x.subscription.remove());
};
