var cron = require("node-cron");
const moment = require("moment");
const { database, auth } = require("./firebase");

// Build Utility Bills
// Check Services , if service does not have a bill for the a month ahead
// build bill in database

const adjustDate = (dueDate, cycle, today) => {
  if (dueDate < today) {
    return adjustDate(dueDate.add(cycle, "days"));
  } else {
    return dueDate;
  }
};

cron.schedule("1 * * * * *", async () => {
  const today = new Date();
  const services = await database.collection("service").get();

  services.docs.map(doc => {
    const { cycle, name, startDate } = doc.data();
    const dueDate = adjustDate(moment(startDate), cycle, today).format("LL");

    database
      .collection("bills")
      .where("dueDate", ">", today)
      .where("service", "==", name)
      .get()
      .then(billsSnapshot => {
        if (billsSnapshot.empty) {
          database
            .collection("bills")
            .doc(name + "_" + dueDate)
            .set({
              dueDate,
              service: name,
              paidUsers: [],
              pastDue: false,
              billPaid: false
            });
        }
      });
  });
});
