const express = require("express");
const paymentController = require("../controller/payment");
const paymentRouter = express.Router();
paymentRouter
  .post("/", paymentController.payment)
  .patch("/user", paymentController.updateUser)
  .patch("/medicine", paymentController.updateMedicine);

exports.paymentRouter = paymentRouter;
