const mongoose = require("mongoose");
const { Schema } = mongoose;

const medicineSchema = new Schema({
  id: String,
  inTotal: Number,
  name: String,
});

const orderSchema = new Schema({
  userId: String,
  date: { type: Date },
  status: Boolean,
  address: String,
  totalItem: Number,
  medicines: [medicineSchema],
});
exports.Order = mongoose.model("Order", orderSchema);

//{ type: Date }
