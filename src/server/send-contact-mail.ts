"use server";
import { Resend } from "resend";
import ReuplanContactMail from "~/components/reuplan-contact-mail";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export default async function sendContactMail(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Reuplan Contact <contact@reuplan.lol>",
      to: "merengueconjamon@gmail.com",
      subject: `Reuplan contact: ${subject}`,
      react: ReuplanContactMail({
        name,
        message,
        email,
      }),
    });

    if (error) {
      console.log(error);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}
