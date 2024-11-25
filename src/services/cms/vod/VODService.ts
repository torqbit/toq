export interface VODService<T> {
  providerName: string;
  saveConfiguration(config: T): Promise<Boolean>;
}
