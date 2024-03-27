import { AppDataSource } from '@/app/config/Datasource';
import {  ObjectType, DataSource } from 'typeorm';

// Decorator Factory
export function XInjectRepository<Entity>(
  entity: ObjectType<Entity>,
) {
  return function (target: any, propertyName: string): void {
    Object.defineProperty(target, propertyName, {
      // Getter function to retrieve the repository
      get() {
        // Accessing the connection instance from the target
        const connection: DataSource = AppDataSource;

        // Return the repository for the specified entity
        return connection.getRepository(entity);
      },
      // Make the property read-only
      configurable: false,
      enumerable: true,
    });
  };
}
