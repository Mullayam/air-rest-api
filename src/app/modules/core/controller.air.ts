export enum MetadataKeys {
  BASE_PATH = 'base_path',
  ROUTERS = 'routers',
}
const Controller = (basePath: string): ClassDecorator => {
  return (target) => {       
 
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath, target);   
  };
}

export default Controller;
