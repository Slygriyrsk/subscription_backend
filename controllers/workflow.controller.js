import { createRequire } from 'module';//this will allow to import commonJS module in ESM
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express"); //because its published in commonJS format can't use import

import subscriptionModel from '../models/subscription.model.js';
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];//when we are getting the reminders

export const sendReminders = serve( async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);
    //check if the renwal date is before, and dayjs will return the curr date
    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping Workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');//get the reminder before some days
        //for eg: renewalDate = 22feb, then user will recieve reminders on 15feb, 17feb, 20feb, 12feb before

        if(renewalDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if(dayjs().isSame(reminderDate, 'day')) {
            //2 days before reminder, trying to match the exact html template from email-tmeplate.js
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription); //we need to pass subscriptions as the 3rd parameter here
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    const raw = await subscriptionModel
      .findById(subscriptionId)
      .populate('user', 'name email')
      .lean(); // ✅ Use .lean() to return plain JS object

    return JSON.parse(JSON.stringify(raw)); // ✅ Breaks any circular refs
  });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        //send emai, sms, push notifications....
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    });
}