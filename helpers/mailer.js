const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: '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'
   }
}));

const send_mail = (to, from, subject, html) => {
   return transporter.sendMail({
      to: to,
      from: from,
      subject: subject,
      html: html
   });
}

exports.send_mail = send_mail;