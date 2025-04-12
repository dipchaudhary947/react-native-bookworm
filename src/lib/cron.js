import Cron from "cron";
import https from "https";

const job = new Cron.CronJob("0 * * * *", function () {
  https.get(process.env.API_URL, (res) => {
    if (res.statusCode === 200) console.log("Get request sent successful");
    else console.log("Get request failed", res.statusCode);
  })
  .on("error", (err) => console.log("Error while sending request", err));
});

export default job;

// * 14 * * * * -> every 14 minutes
// * * * * * * -> every minute
// * * * * * -> every hour
// * * * * -> every day
// * * * -> every month
// * * -> every year
// * -> every second
// */5 * * * * -> every 5 minutes
// */10 * * * * -> every 10 minutes
// */15 * * * * -> every 15 minutes
// */20 * * * * -> every 20 minutes
// */30 * * * * -> every 30 minutes
// */45 * * * * -> every 45 minutes
// */60 * * * * -> every 60 minutes
// 0 * * * * -> every hour
// 0 0 * * * -> every day
// 0 0 0 * * -> every month
// 0 0 0 0 * -> every year
// * 0 0 * * * -> every day at 00:00
// * 0 0 * * 0 -> At midnight every Sunday
// * 30 3 15 * * -> At 3:30 on the 15th day of every month
// * 0 0 1 1 * -> At midnight on the first january
// * 0 * * * * -> Every hour
