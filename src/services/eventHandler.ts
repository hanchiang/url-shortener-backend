import { RedirectUrlPayload, ShortenUrlPayload } from '../types/eventTypes';

export interface EventHandlerService {
  handleRedirectUrl(payload: RedirectUrlPayload): Promise<void>;
  handleShortenUrl(payload: ShortenUrlPayload): Promise<void>;
}
