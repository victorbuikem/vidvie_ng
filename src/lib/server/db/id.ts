import { ulid } from 'ulid';

export type IdPrefix = 'cat' | 'prod' | 'ord' | 'oi' | 'cart' | 'ci';

export const createId = (prefix: IdPrefix): string => `${prefix}_${ulid()}`;
