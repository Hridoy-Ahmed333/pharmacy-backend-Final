const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const categoryRouter = require("./routes/category"); // Import the cors package
const medicineRouter = require("./routes/medicine");
const searchRouter = require("./routes/search");
const supplyRouter = require("./routes/supply");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/payment");
const model = require("./model/user");
const User = model.User;

const server = express();

const path = require("path");
const stripe = require("stripe")(
  "sk_test_51OpvC0A1UboyhyVAiOzJKaf270wU4BZ4yqPIGeMw1h6oj62RgsZlKR6VGt7VAUagtuKznWLxRRcqlWxtGSiB9yYo00RZokXx7l"
);
// Assuming your images are in the Images directory relative to your script

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/pharmacy");
  console.log("Connected with database");
}

const auth = (req, res, next) => {
  const token = req.get("Authorization")?.split("Bearer ")[1];
  console.log(token);
  try {
    var decoded = jwt.verify(token, "shhhhh");
    console.log(decoded);
    if (decoded.email) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(401);
  }
};
const storeItems = new Map([
  [1, { price: 10000, name: "napa1" }],
  [2, { price: 10000, name: "napa2" }],
]);

server.use("/images", express.static(path.join(__dirname, "Images")));
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(morgan("combined"));
server.use(express.static("public"));
server.use("/category", categoryRouter.categoryRouter);
server.use("/medicine", medicineRouter.medicineRouter);
server.use("/search", searchRouter.searchRouter);
server.use("/supply", supplyRouter.supplyRouter);
server.use("/auth", authRouter.router);
server.use("/users", auth, userRouter.router);
server.use("/payment", auth, paymentRouter.paymentRouter);
server.use("/orders", auth, orderRouter.orderRouter);

server.listen(8080, () => {
  console.log("Server started");
});
