import events from 'events';
import { EventListener } from '../types/eventTypes';

// https://stackoverflow.com/questions/39142858/declaring-events-in-a-typescript-class-which-extends-eventemitter
export interface EventEmitterService extends events.EventEmitter {
  _on: events.EventEmitter['on'];
  _emit: events.EventEmitter['emit'];
  _removeListener: events.EventEmitter['removeListener'];
  _removeAllListeners: events.EventEmitter['removeAllListeners'];

  on<K extends keyof EventListener>(
    event: K,
    listener: EventListener[K],
    async?: boolean
  ): this;

  emit<K extends keyof EventListener>(
    event: K,
    ...args: Parameters<EventListener[K]>
  ): boolean;

  removeListener<K extends keyof EventListener>(
    event: K,
    listener: EventListener[K]
  ): this;

  removeAllListeners<K extends keyof EventListener>(event: K): this;
}
