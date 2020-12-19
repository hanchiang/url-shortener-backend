export interface ErrorResponse {
  error: {
    message: string;
    type?: string;
    stack?: string; // in develpment mode only
    meta?: { [key: string]: any } // additional info
  }
}

export interface SuccessRespone {
  payload: any
}