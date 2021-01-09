export interface ObjectionError {
  message: string;
  status: number;
  type?: string;
  meta?: { [key: string]: any };
}
