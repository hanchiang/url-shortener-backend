interface EventEmitterBase<T> {
  payload: T;
  meta?: Record<string, unknown>
}

export interface RedirectUrl {
  hash: string;
}

export interface ShortenUrl {
  originalUrl: string
  alias?: string
}

export type RedirectUrlPayload = EventEmitterBase<RedirectUrl>;
export type ShortenUrlPayload = EventEmitterBase<ShortenUrl>;

export interface EventListener {
  redirectUrl: (payload: RedirectUrlPayload) => Promise<void>;
  shortenUrl: (payload: ShortenUrlPayload) => Promise<void>;
  error: (error: any) => Promise<void>;
}
