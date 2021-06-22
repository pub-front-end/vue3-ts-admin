declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;

declare type Indexable<T = any> = {
  [key: string]: T;
};

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
