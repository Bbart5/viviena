import type { Handle } from "@sveltejs/kit";
import { MailTransport } from "$lib/server/mail/MailTransport";

MailTransport.getInstance();

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};