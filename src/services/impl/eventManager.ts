import { EventHandlerService } from '../eventHandler';
import { EventHandlerServiceImpl } from './eventHandler';
import { EventEmitterService } from '../eventEmitter';
import { EventEmitterServiceImpl } from './eventEmitter';
import { EventManagerService } from '../eventManager';
import logger from '../../utils/logger';

// TODO: test
export class EventManagerServiceImpl implements EventManagerService {
  private static instance: EventManagerServiceImpl;
  private eventHandlerService: EventHandlerService;
  private eventEmitterService: EventEmitterService;

  private isRegistered: boolean;

  private constructor(
    eventHandlerService: EventHandlerService,
    eventEmitterService: EventEmitterService
  ) {
    this.eventHandlerService = eventHandlerService;
    this.eventEmitterService = eventEmitterService;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = EventManagerServiceImpl.defaultImpl();
    }
    return this.instance;
  }

  private static defaultImpl(): EventManagerServiceImpl {
    return new EventManagerServiceImpl(
      EventHandlerServiceImpl.defaultImpl(),
      EventEmitterServiceImpl.getInstance()
    );
  }

  public registerListeners(): Promise<void> {
    if (this.isRegistered) {
      logger.info('Event listeners are already registered');
      return;
    }

    this.eventEmitterService.on('error', async (error: any) => {
      logger.error('Encountered error in event listener: ', error);
    });
    this.eventEmitterService.on(
      'redirectUrl',
      this.eventHandlerService.handleRedirectUrl.bind(this.eventHandlerService)
    );
    this.eventEmitterService.on(
      'shortenUrl',
      this.eventHandlerService.handleShortenUrl.bind(this.eventHandlerService)
    );
    this.isRegistered = true;
    logger.info('Registered event listeners');

    return;
  }

  public deregisterListeners(): Promise<void> {
    this.eventEmitterService.removeListener('error', async (error: any) => {
      logger.error('Encountered error in event listener: ', { error });
    });
    this.eventEmitterService.removeListener(
      'redirectUrl',
      this.eventHandlerService.handleRedirectUrl.bind(
        this.eventHandlerService.handleRedirectUrl
      )
    );
    this.eventEmitterService.removeListener(
      'shortenUrl',
      this.eventHandlerService.handleShortenUrl.bind(
        this.eventHandlerService.handleShortenUrl
      )
    );
    return;
  }
}
