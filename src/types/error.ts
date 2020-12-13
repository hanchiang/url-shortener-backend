export interface ThrowError {
  status: number;
  message: string;
}

export interface CustomError extends Error {
  status: number;
}
