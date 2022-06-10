export const keyof = <T>(obj: T): Array<keyof T> => Object.keys(obj) as any
