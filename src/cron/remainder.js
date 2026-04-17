import cron from "node-cron";
import { Issue } from "../models/issue.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  bookReminderEmail,
  overdueBookEmail,
} from "../services/remainderMail.js";

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Reminder Cron Running");

  

  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + 2);

  const issues = await Issue.find({
    status: "issued",
    reminderSent: false,
    dueDate: { $gte: today, $lte: reminderDate },
  }).populate("user book");

  for (let issue of issues) {
    await sendEmail({
      to: issue.user.email,
      subject: "📚 Book Return Reminder",
      html: bookReminderEmail(
        issue.user.name,
        issue.book.title,
        issue.dueDate
      ),
    });

    issue.reminderSent = true;
    await issue.save();
  }

  const overdue = await Issue.find({
    status: "issued",
    dueDate: { $lt: today },
  }).populate("user book");

  for (let issue of overdue) {
    await sendEmail({
      to: issue.user.email,
      subject: "⚠️ Overdue Book Alert",
      html: overdueBookEmail(
        issue.user.name,
        issue.book.title
      ),
    });
  }


  
  console.log("✅ Reminder + Overdue emails sent");
});