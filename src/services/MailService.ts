import path from "path";
import { Logging } from "../logs/index.js";
import * as Mail from "nodemailer/lib/mailer";
import nodemailer, { Transporter } from "nodemailer";
import { MailOptionsWithTemplate } from "../types/index.js";
import { MailOptions } from "nodemailer/lib/json-transport/index.js";
import hbs, { NodemailerExpressHandlebarsOptions, TemplateOptions } from 'nodemailer-express-handlebars';
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const TemplatePath = path.join(process.cwd(), 'src', "resources", "templates");
export class MailService {
    private static instance: MailService;
    private transporter!: Transporter;
    constructor() {
        this.createConnection()
        this.HbsTemplateEngine()
    }
    /**
     * Creates a connection to the email server using the provided configuration.
     *
     * @return {Promise<void>} Promise that resolves when the connection is successfully created.
     */
    private async createConnection(): Promise<void> {
        this.transporter = nodemailer.createTransport({
           ...this.TransportOptions()
        });
    }
    private TransportOptions(): SMTPTransport.Options {
        return {
            host: process.env.MAIL_HOST as string,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            
        };
    } 
    /**
     * Initializes the HbsTemplateEngine.     
     */
    private HbsTemplateEngine() {
        this.transporter.use('compile', hbs({ ...this.hbsOptions() }));

    }
    /**
     * Retrieves the transporter.
     *
     * @return {Transporter} The transporter object.
     */
    getTransporter(): Transporter {
        return this.transporter;
    }
    private hbsOptions(): NodemailerExpressHandlebarsOptions {
        return {
            viewEngine: {
                extname: '.hbs',
                partialsDir: TemplatePath,
                layoutsDir: TemplatePath,
                defaultLayout: ''
            },
            viewPath: TemplatePath,
            extName: '.hbs'
        };
    }
    /**
     * Returns the instance of the MailService class if it exists,
     * otherwise creates a new instance and returns it.
     *
     * @return {MailService} The instance of the MailService class.
     */
    static createInstance(): MailService {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    async SendMail({ to, subject, text, html, from }: MailOptions): Promise<any> {
        if (!from) {
            from = `${process.env.SENDER_NAME as string} <${process.env.MAIL_USER as string}>`
        }
        return await this.transporter
            .sendMail({
                from, // sender address
                to,
                subject,
                text,
                html,
            })
            .then((info) => {
                Logging.info(` Mail sent successfully to ${to} [MailResponse]=${info.response} [MessageID]=${info.messageId}!!`);
                return info;

            });
    }
    async SendTemplate({ to, subject, template, context, from }: MailOptionsWithTemplate): Promise<any> {
        if (!from) {
            from = `${process.env.SENDER_NAME as string} <${process.env.MAIL_USER as string}>`
        }
        const PrepareEmailOptions: Mail.Options & TemplateOptions = {
            from,
            to,
            subject,
            template,
            context
        }
        return await this.transporter
            .sendMail(PrepareEmailOptions)
            .then((info) => {
                Logging.info(` Mail sent successfully to ${to} [MailResponse]=${info.response} [MessageID]=${info.messageId}!!`);
                return info;
            });
    }
}