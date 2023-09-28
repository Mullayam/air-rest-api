import { Token } from '../token.class.js';
import { Constructable } from './constructable.type.js';
import { AbstractConstructable } from './abstract-constructable.type.js';

/**
 * Unique service identifier.
 * Can be some class type, or string id, or instance of Token.
 */
export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | Token<T>
  | string;
