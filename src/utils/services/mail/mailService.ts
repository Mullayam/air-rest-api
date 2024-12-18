import path from "path";
import { Logging } from "@/logs";
import * as Mail from "nodemailer/lib/mailer";
import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";
import { MailOptionsWithTemplate } from "@/utils/interfaces/mail.interface";
import { MailOptions } from "nodemailer/lib/json-transport";
import hbs, { NodemailerExpressHandlebarsOptions, TemplateOptions } from 'nodemailer-express-handlebars';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {__CONFIG__ } from "@/app/config";

const TemplatePath = path.join(process.cwd(), 'src', "resources", "templates");
export class MailService {
    private static instance: MailService;
    private transporter!: Transporter;
    constructor() {
        Logging.dev("MailService Initialized")
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
    /**
     * Returns the transport options for the SMTP server.
     *
     * @private
     * @returns {SMTPTransport.Options} The transport options for the SMTP server.
     */
    private TransportOptions(): SMTPTransport.Options {
        return {
            host: __CONFIG__.SMTP_SETTINGS.SMTP_HOST as string,
            port: Number(__CONFIG__.SMTP_SETTINGS.SMTP_HOST_PASS),
            secure: false,
            auth: {
                user: __CONFIG__.SMTP_SETTINGS.SMTP_HOST_USER,
                pass: __CONFIG__.SMTP_SETTINGS.SMTP_HOST_PASS,
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
    /**
     * Generates the options object for the Handlebars view engine in Nodemailer.
     *
     * @return {NodemailerExpressHandlebarsOptions} The options object for the Handlebars view engine.
     */
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
    /**
     * Sends an email.
     *
     * @param {MailOptions} options - The options for the email.
     * @param {string} options.to - The recipient of the email.
     * @param {string} options.subject - The subject of the email.
     * @param {string} options.text - The plain text body of the email.
     * @param {string} options.html - The HTML body of the email.
     * @param {string} options.from - The sender of the email. If not provided, it will be set to the environment variable SENDER_NAME and MAIL_USER.
     * @return {Promise<SentMessageInfo>} Returns a Promise that resolves to the SentMessageInfo object, which contains information about the sent email.
     */
    async SendMail({ to, subject, text, html, from }: MailOptions): Promise<SentMessageInfo> {
        if (!from) {
            from = `${process.env.SENDER_NAME as string} < ${process.env.MAIL_USER as string} >`
        }
        if (Array.isArray(to)) {
            to = to.join(',')
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
    /**
     * Sends an email template to the specified recipient.
     *
     * @param {MailOptionsWithTemplate} options - The options for sending the email.
     * @param {string} options.to - The email address of the recipient.
     * @param {string} options.subject - The subject of the email.
     * @param {string} options.template - The template to use for the email.
     * @param {object} options.context - The context data for the email template.
     * @param {string} [options.from] - The email address of the sender. If not provided, the default sender will be used.
     * @returns {Promise<SentMessageInfo>} The information about the sent email.
     */
    async SendTemplate({ to, subject, template, context, from }: Omit<MailOptionsWithTemplate, 'text' | 'html'>): Promise<SentMessageInfo> {
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
    static getInstance(): MailService {
        return MailService.instance;
    }
}
