/* eslint-disable */
/**
 * https://stackoverflow.com/a/60118644/9768266
 */

export type AllKeys<T> = T extends any ? keyof T : never;

export type OptionalKeys<T> = T extends any
  ? { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]
  : never;

export type Idx<T, K extends PropertyKey, D = never> = T extends any
  ? K extends keyof T
    ? T[K]
    : D
  : never;

export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

export type Widen<T> = [T] extends [Array<infer _E>]
  ? { [K in keyof T]: Widen<T[K]> }
  : [T] extends [object]
    ? PartialKeys<
        { [K in AllKeys<T>]: Widen<Idx<T, K>> },
        Exclude<AllKeys<T>, keyof T> | OptionalKeys<T>
      >
    : T;
