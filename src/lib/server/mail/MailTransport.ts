import { GMAIL_APP_PASSWORD, GMAIL_USER } from "$env/static/private";
import nodemailer from "nodemailer";

export class MailTransport {
  private static transporter: nodemailer.Transporter;

  private constructor() {
		MailTransport.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_APP_PASSWORD
			}
		});
	}

  public static getInstance() {
    if (!MailTransport.transporter) {
      new MailTransport();
    }

    return MailTransport.transporter;
  }
}