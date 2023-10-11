export enum MetadataKeys {
  BASE_PATH = 'base_path',
  ROUTERS = 'routers',
  MIDDLEWARE = 'middleware',
  INTERCEPTOR = 'interceptor',
}
const Controller = (basePath: string, ...args: any[]): ClassDecorator => {
  let call: any[] = []
  return (target) => {
    args.forEach((arg) => {
      call.push((new arg)["useContext"])
    })
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, { path: basePath, middleware: call }, target);
  };
}

export default Controller;
