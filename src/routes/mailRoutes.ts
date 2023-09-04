//  Write Your All EMail Services Routes Here
import { Router } from 'express'
import { XResponse } from '../app/lib/Response.js';
import { MailService } from '../services/MailService.js';
export class MailRoutes {
    constructor(public mailRoute: Router = Router(), private Email: MailService = MailService.getInstance()) {
        this.LoadRoutes();
    }

    /**
     Creates the Public Routes 
     */
    private LoadRoutes(): void {
        this.mailRoute.get("/test/mail", () => {
            this.Email.SendTemplate({ to: "your mail", subject: "Test", template: "welcome-mail", context: { date: new Date(), name: "Developer", imgUrl: `${process.env.APP_IMG_URL}/welcome-mail` }, })
            XResponse.JSON({ message: "Mail test Route2" })
        })
    }

} 