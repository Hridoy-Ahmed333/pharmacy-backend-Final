const mongoose = require("mongoose");
const { Schema } = mongoose;
const supplySchema = new Schema({
  supplierId: String,
  productId: String,
  amount: Number,
  totalCost: Number,
  dilevered: Boolean,
  time: { type: Date },
});

exports.Supply = mongoose.model("Supply", supplySchema);
