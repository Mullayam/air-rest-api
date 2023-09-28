/**
 * We have a hard dependency on reflect-metadata package.
 * Without the dependency lookup wont work. So we should warn the users
 * when it's not loaded.
 */
// if(!Reflect || !(Reflect as any).getMetadata) {
//   throw new Error('Reflect.getMetadata is not a function. Please import the "reflect-metadata" package at the first line of your application.');
// }

export * from './decorators/inject-many.decorator.js';
export * from './decorators/controller.decorator.js';
export * from './decorators/inject.decorator.js';
export * from './decorators/service.decorator.js';

export * from './error/cannot-inject-value.error.js';
export * from './error/cannot-instantiate-value.error.js';
export * from './error/service-not-found.error.js';

export { Handler } from './interfaces/handler.interface.js';
export { ServiceMetadata } from './interfaces/service-metadata.interface.js';
export { ServiceOptions } from './interfaces/service-options.interface.js';
export { Constructable } from './types/constructable.type.js';
export { ServiceIdentifier } from './types/service-identifier.type.js';

export { ContainerInstance } from './container-instance.class.js';
export { Container } from './container.class.js';
export { Token } from './token.class.js';


