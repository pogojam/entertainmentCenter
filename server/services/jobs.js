var cron = require("node-cron");
const moment = require("moment");
const { database, auth } = require("./firebase");

// Build Utility Bills
// Check Services , if service does not have a bill for the a month ahead
// build bill in database

const adjustDate = (dueDate, cycle, today) => {
  if (dueDate < today) {
    return adjustDate(dueDate.add(cycle, "days"), cycle, today);
  } else {
    return dueDate;
  }
};

cron.schedule("1 * * * * *", async () => {
  console.log("fire cron");
  const today = new Date();
  const services = await database.collection("service").get();

  services.docs.map((doc) => {
    const { cycle, name, startDate } = doc.data();
    const dueDate = adjustDate(moment(startDate), cycle, today).toDate();
    console.log(dueDate);
    database
      .collection("bills")
      .where("dueDate", ">", today)
      .where("service", "==", name)
      .get()
      .then((billsSnapshot) => {
        if (billsSnapshot.empty) {
          console.log("Empty");
          database
            .collection("bills")
            .doc(name + "_" + moment(dueDate).format("LL"))
            .set({
              dueDate,
              service: name,
              paidUsers: [],
              pastDue: false,
              billPaid: false,
            });
        }
      });

    database
      .collection("bills")
      .where("dueDate", "<", today)
      .where("pastDue", "==", false)
      .where("service", "==", name)
      .get()
      .then((billsSnapshot) => {
        if (!billsSnapshot.empty) {
          const batch = database.batch();
          billsSnapshot.forEach((bill) => {
            batch.update(bill.ref, { pastDue: true });
          });
          batch.commit();
        }
      });
  });
});
