// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674500430
export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _Tuple<T, N, []>) : never;
type _Tuple<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _Tuple<T, N, [T, ...R]>;
