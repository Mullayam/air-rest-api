import { Application } from "express";

export class Modifiers {
    constructor(private readonly app: Application) {
        this.set()
    }
    set() {
        this.app.locals.title = "Air API - ENJOYS"
    }
    mount() {
        this.app.on('mount', function (parent) {
            console.log('Application Mounted')
           
          })
    }
}