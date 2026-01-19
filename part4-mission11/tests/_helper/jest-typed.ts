export type Awaited<T> = T extends Promise<infer U> ? U : T;

export function asMockFn<TArgs, TReturn>(
  fn: (args: TArgs) => Promise<TReturn>
) {
  return fn as jest.MockedFunction<(args: TArgs) => Promise<TReturn>>;
}

/** 공통 함수 시그니처 */
type FnLike = (...args: unknown[]) => unknown;

/**  새 범용 캐스터: 인자 0개/여러 개/옵셔널 모두 커버 */
export type MockedFn<Fn extends FnLike> = jest.MockedFunction<Fn>;

export function asMock<Fn extends FnLike>(fn: Fn) {
  return fn as jest.MockedFunction<Fn>;
}
