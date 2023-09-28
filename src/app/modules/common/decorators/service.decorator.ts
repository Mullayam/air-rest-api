import { Container } from '../container.class.js';
import { Token } from '../token.class.js';
import { ServiceMetadata } from '../interfaces/service-metadata.interface.js';
import { ServiceOptions } from '../interfaces/service-options.interface.js';
import { EMPTY_VALUE } from '../empty.const.js';
import { Constructable } from '../types/constructable.type.js';

/**
 * Marks class as a service that can be injected using Container.
 */
export function Injectable<T = unknown>(): Function;
export function Injectable<T = unknown>(name: string): Function;
export function Injectable<T = unknown>(token: Token<unknown>): Function;
export function Injectable<T = unknown>(options?: ServiceOptions<T>): Function;
export function Injectable<T>(optionsOrServiceIdentifier?: ServiceOptions<T> | Token<any> | string): ClassDecorator {
  return targetConstructor => {
    const serviceMetadata: ServiceMetadata<T> = {
      id: targetConstructor,
      // TODO: Let's investigate why we receive Function type instead of a constructable.
      type: (targetConstructor as unknown) as Constructable<T>,
      factory: undefined,
      multiple: false,
      global: false,
      eager: false,
      transient: false,
      value: EMPTY_VALUE,
    };

    if (optionsOrServiceIdentifier instanceof Token || typeof optionsOrServiceIdentifier === 'string') {
      /** We received a Token or string ID. */
      serviceMetadata.id = optionsOrServiceIdentifier;
    } else if (optionsOrServiceIdentifier) {
      /** We received a ServiceOptions object. */
      serviceMetadata.id = (optionsOrServiceIdentifier as ServiceMetadata).id || targetConstructor;
      serviceMetadata.factory = (optionsOrServiceIdentifier as ServiceMetadata).factory || undefined;
      serviceMetadata.multiple = (optionsOrServiceIdentifier as ServiceMetadata).multiple || false;
      serviceMetadata.global = (optionsOrServiceIdentifier as ServiceMetadata).global || false;
      serviceMetadata.eager = (optionsOrServiceIdentifier as ServiceMetadata).eager || false;
      serviceMetadata.transient = (optionsOrServiceIdentifier as ServiceMetadata).transient || false;
    }

    Container.set(serviceMetadata);
  };
}
