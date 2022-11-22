export interface ApplicationLogger {
  info: ((msg?: string, ...args: any[]) => void) &
    (<T extends object>(obj: T) => void) &
    (<T extends object>(obj: T, msg?: string, ...args: any[]) => void)

  warn: ((msg?: string, ...args: any[]) => void) &
    (<T extends object>(obj: T) => void) &
    (<T extends object>(obj: T, msg?: string, ...args: any[]) => void)

  error: ((msg?: string, ...args: any[]) => void) &
    (<T extends Error>(error: T) => void) &
    (<T extends Error>(error: T, msg?: string, ...args: any[]) => void)
}
