import { Application} from "express"
import listEndpoints from 'list_end_points'
 
export class RouteResolver {
   private print(path: any, layer: any) {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(path.concat(this.split(layer.route.path))))
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(path.concat(this.split(layer.regexp))))
        } else if (layer.method) {
            console.log('%s /%s',
                layer.method.toUpperCase(),
                path.concat(this.split(layer.regexp)).filter(Boolean).join('/'))
        }
    }

    private  split(thing: any) {  
        if (typeof thing === 'string') {
            return thing.split('/')
        } else if (thing.fast_slash) {
            return ''
        } else {
            var match = thing.toString()
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '$')
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
            return match
                ? match[1].replace(/\\(.)/g, '$1').split('/')
                : '<complex:' + thing.toString() + '>'
        }
    }

    static Mapper(AppServer: Application) {
        listEndpoints.default(AppServer)  
             
        // AppServer._router.stack.forEach(this.print.bind([]))
    }
}