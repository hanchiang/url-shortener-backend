import events from 'events';
import { EventListener } from '../../types/eventTypes';
import { EventEmitterService } from '../eventEmitter';

// TODO: test
export class EventEmitterServiceImpl
  extends events.EventEmitter
  implements EventEmitterService
{
  _on;
  _emit;
  _removeListener;
  _removeAllListeners;

  private static instance: EventEmitterServiceImpl;

  private constructor() {
    super({
      captureRejections: true,
    });
    this._on = super.on;
    this._emit = super.emit;
    this._removeListener = super.removeListener;
    this._removeAllListeners = super.removeAllListeners;
  }

  public static getInstance(maxListeners = 5): EventEmitterServiceImpl {
    if (!this.instance) {
      this.instance = new EventEmitterServiceImpl();
    }
    this.instance.setMaxListeners(maxListeners);
    return this.instance;
  }

  public on<K extends keyof EventListener>(
    event: K,
    listener: EventListener[K],
    async = true
  ): this {
    if (async) {
      setImmediate(() => {
        this._on(event, listener);
      });
    } else {
      return this._on(event, listener);
    }
  }

  public emit<K extends keyof EventListener>(
    event: K,
    ...args: Parameters<EventListener[K]>
  ): boolean {
    return this._emit(event, ...args);
  }

  public removeListener<K extends keyof EventListener>(
    event: K,
    listener: EventListener[K]
  ): this {
    return this._removeListener(event, listener);
  }

  public removeAllListeners<K extends keyof EventListener>(event: K): this {
    return this._removeAllListeners(event);
  }
}
