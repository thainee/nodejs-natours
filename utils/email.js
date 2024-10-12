import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import path from 'node:path';

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Thai Vo <${process.env.MAILERSEND_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        host: process.env.MAILERSEND_HOST,
        port: process.env.MAILERSEND_PORT,
        secure: false,
        auth: {
          user: process.env.MAILERSEND_USERNAME,
          pass: process.env.MAILERSEND_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const fileUrl = path.join(
      import.meta.dirname,
      '..',
      'views',
      'emails',
      `${template}.pug`,
    );
    const html = pug.renderFile(fileUrl, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendResetPassword() {
    await this.send('resetPassword', 'Reset your Natours password!');
  }
}

export default Email;
