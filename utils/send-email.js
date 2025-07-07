import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import { accountEmail, transporter } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if(!to || !type) throw new Error('Missing required parameters');

    //check like for which template we are going to send reminder is it 5days or 7days or so...
    const template = emailTemplates.find((t) => t.label === type);

    if(!template) throw new Error('Invalid email template');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'), //like Nov 29, 2003
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`, //like INR 149 monthly
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) return console.log(err, 'Error Sending Email');

        console.log('Email sent: ' + info.response);
    })
}