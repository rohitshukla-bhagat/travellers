const mongoose = require("mongoose");
const initData = require("./data2.js");
const Listing = require("../modules/listing.js");

const MONGODB_URL = "mongodb://127.0.0.1:27017/travellers";

main()
  .then(() => {
    console.log("Connection Successful !");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGODB_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67ad8368fa83a8f3da675903",
  }));
  await Listing.insertMany(initData.data);
};

initDB();
