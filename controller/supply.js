const mongoose = require("mongoose");
const model = require("../model/supply");
const model2 = require("../model/medicine");
const Supply = model.Supply;
const Medicine = model2.Medicine;

exports.createSupply = async (req, res) => {
  const newSupply = new Supply({
    ...req.body,
    supplierId: "", // Add or override properties as needed
    dilevered: false,
    time: Date.now(), // Add or override properties as needed
  });
  console.log(newSupply);
  try {
    const output = await newSupply.save();
    console.log(output);
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// exports.getSuppply = async (req, res) => {
//   try {
//     const supply = await Supply.find();
//     const med = supply.map(async (el) => {
//       const product = await Medicine.findById(el.productId);

//       const response = { el, product: product };
//       return response;
//     });
//     console.log(med);
//     const items = { supply: supply };
//     res.json(med);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// };

exports.getSuppply = async (req, res) => {
  try {
    const supply = await Supply.find();
    const med = await Promise.all(
      supply.map(async (el) => {
        const product = await Medicine.findById(el.productId);

        const response = { el, product: product };
        return response;
      })
    );
    res.json(med);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.updateSupply = async (req, res) => {
  const id = req.body._id;
  console.log(req.body);
  try {
    const supply = await Supply.findById(id);
    await Supply.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    const product = await Medicine.findById(supply.productId);
    const money = product.totalBuyMone + supply.totalCost;
    const item = product.totalItemBuy + supply.amount;
    const stock = product.stock + supply.amount;
    const updateMed = { totalBuyMone: money, totalItemBuy: item, stock: stock };
    await Medicine.findOneAndUpdate({ _id: supply.productId }, updateMed, {
      new: true,
    });
    res.json({ message: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
};
