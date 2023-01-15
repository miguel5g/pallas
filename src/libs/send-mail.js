import nodemailer from 'nodemailer';

import { renderTemplate } from './mail-templates';

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

/**
 * @param {'welcome'} template
 * @param {*} param1
 */
async function sendMail(template, { to, ...data }) {
  const { html, text, title, from } = await renderTemplate(template, data);

  transport.sendMail({
    from,
    to,
    subject: title,
    html,
    text,
  });
}

export { sendMail, transport };
