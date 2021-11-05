export type Unpacked<T> = T extends PromiseLike<infer U> ? U : T;

export type Hidden = {
  hidden: boolean;
}