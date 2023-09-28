import { Controller, JsonController } from "@enjoys/modules";
import { Injectable } from "./service.decorator.js";
import { Container } from "../container.class.js";
import { Constructable, ServiceIdentifier } from "../index.js";
import { resolveToTypeWrapper } from "../utils/resolve-to-type-wrapper.util.js";
import { constants } from "buffer";

export function XController(...args: Parameters<typeof Controller>) {
    return <TFunction extends Function>(target: TFunction) => {
        Injectable()(target);
        Controller(...args)(target);
    };
}

export function XJsonController(...args: Parameters<typeof Controller>) {
    return <TFunction extends Function>(target: TFunction) => {
        Injectable()(target);
        JsonController(...args)(target);
    };
}
export function InjectService<T>(identifier: Constructable<T>): any {
    return (target: Object, key: string, descriptor: PropertyDescriptor) => {
        let value: any = Container.get(identifier);
        const getter = () => value
        const setter = () => value
        Object.defineProperty(target, key, {
            get: getter,
            set: setter
        })
    }

}