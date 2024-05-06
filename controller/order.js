const mongoose = require("mongoose");
const model = require("../model/order");
const model3 = require("../model/medicine");
const model2 = require("../model/user");
const Order = model.Order;
const Medicine = model3.Medicine;
const User = model2.User;

exports.createOrder = async (req, res) => {
  const { order, user: token, address } = req.body;
  //console.log(order, user);
  const user = await User.findOne({ token: token });
  //console.log(user);
  const date = Date.now();
  const userId = user._id;
  const status = false;
  const totalItem = order.totalItem;
  const medicines = order.OrderItemDetails;
  console.log("Your Address is", address);

  const newOrder = new Order({
    userId,
    date,
    status,
    totalItem,
    medicines,
    address,
  });

  try {
    const output = await newOrder.save(); // Save the new instance
    //console.log(output);
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.getOrder = async (req, res) => {
  const orderIds = req.body.orderIds;
  try {
    const medicines = await Medicine.find({ _id: { $in: orderIds } });
    //console.log(medicines);
    if (medicines.length > 0) {
      res.status(200).json(medicines);
    } else {
      console.log("No medicines found for the given order IDs.");
      res
        .status(404)
        .json({ message: "No medicines found for the given order IDs." });
    }
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Error fetching medicines." });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const order = await Order.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
