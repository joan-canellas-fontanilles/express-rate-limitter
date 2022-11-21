export interface RequestStore {
  remaining: (
    identifier: string,
    limit: number,
    timeWindow: number
  ) => Promise<number>

  getFirstRequestTimestamp: (identifier: string) => Promise<number>
}
