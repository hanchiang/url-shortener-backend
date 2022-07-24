export interface EventManagerService {
  registerListeners(): Promise<void>;
  deregisterListeners(): Promise<void>;
}
