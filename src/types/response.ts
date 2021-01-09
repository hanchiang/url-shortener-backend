export interface ErrorPayload {
  message: string;
  type?: string;
  stack?: string; // in develpment mode only
  meta?: { [key: string]: any }; // additional info
}

export interface ErrorResponse {
  error: ErrorPayload;
}

export interface SuccessResponse {
  payload: any;
}
