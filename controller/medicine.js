const mongoose = require("mongoose");
const model = require("../model/medicine");

const Medicine = model.Medicine;

//Adding one Document
exports.createMedicine = async (req, res) => {
  //console.log("Create req is:", req.body, req.file);
  let response;
  if (!req.body.discountPercentage) {
    response = { ...req.body, discountPercentage: 0 };
  } else {
    response = req.body;
  }
  try {
    if (!req.file) {
      res.json({
        success: false,
        message: "No file was provided",
      });
    } else {
      let medicine = new Medicine({
        ...response,
        rating: 0,
        totalRating: 0,
        stock: 0,
        image: req.file.filename,
        totalItemBuy: 0,
        totalItemSold: 0,
        totalBuyMone: 0,
        totalSellMoney: 0,
      });
      const savedMedicine = await medicine.save();
      res.json({
        success: true,
        message: "Medicine added successfully",
        medicine: savedMedicine,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message, // Send the exact error message
    });
  }
};

//Getting all the documents
exports.getAllMedicine = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    console.log(req.body);
    res.json(medicines);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting one Document
exports.GetOneMedicine = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const medicine = await Medicine.findById(id);
    res.json(medicine);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Put Operation on document
exports.replaceMedicine = async (req, res) => {
  const id = req.params.id;
  try {
    const medicine = await Medicine.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    res.json(medicine);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Update operation on document
exports.updateMedicine = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  if (req.file) {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: id },
      { ...req.body, image: req.file.filename },
      {
        new: true,
      }
    );
    res.json(medicine);
  } else {
    const medicine = await Medicine.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.json(medicine);
  }
};

exports.updateStar = async (req, res) => {
  console.log("Update Req is");
  const id = req.params.id;

  const medicine = await Medicine.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.json(medicine);
};

//Deleting Document
exports.deleteMedicine = async (req, res) => {
  const id = req.params.id;
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: id });
    res.json(medicine);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// exports.searchMedicine = async (req, res) => {
//   console.log("The search body is: ", req.body);
//   const {
//     searchText: search,
//     categoryFilter: category,
//     inStockFilter: stock,
//   } = req.body;
//   try {
//     const searchExp = new RegExp(search, i);
//     const categoryExp = new RegExp(category, i);
//     let medicines = await Medicine.find()
//       .where("name")
//       .regex(searchExp)
//       .where("category")
//       .regex(categoryExp);

//     if (stock) {
//       medicines = medicines.where("stock").gt(0);
//     }
//     const results = await medicines.exec();
//     console.log(results);
//     res.json(results);
//   } catch (error) {
//     console.log(error);
//     res.json("Could Not Find the Searched Results. And Error occured");
//   }
// };

// exports.searchMedicine = async (req, res) => {
//   console.log("The search body is: ", req.body);
//   const {
//     searchText: search,
//     categoryFilter: category,
//     inStockFilter: stock,
//   } = req.body;
//   try {
//     const searchExp = new RegExp(search, "i");
//     const categoryExp = new RegExp(category, "i");
//     let query = Medicine.find()
//       .where("name")
//       .regex(searchExp)
//       .where("category")
//       .regex(categoryExp);

//     if (stock) {
//       query = query.where("stock").lte(0);
//     }
//     const results = await query.exec();

//     if (results) {
//       console.log("The result is :", results);
//     } else {
//       console.log("No Result");
//     }

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "An error occurred while searching for medicines.",
//       error: error.message,
//     });
//   }
// };

exports.searchMedicine = async (req, res) => {
  console.log("The search body is: ", req.body);
  const { searchText: search } = req.body;
  try {
    const searchExp = new RegExp(search, "i");
    let query = Medicine.find().where("name").regex(searchExp);

    const results = await query.exec();

    if (results) {
      console.log("The result is :", results);
    } else {
      console.log("No Result");
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while searching for medicines.",
      error: error.message,
    });
  }
};

exports.searchByCategoryMedicine = async (req, res) => {
  console.log("The search body is: ", req.body);
  const { categoryFilter: category } = req.body;
  try {
    let query = Medicine.find().where("category").equals(category);
    const results = await query.exec();

    if (results) {
      console.log("The result is :", results);
    } else {
      console.log("No Result");
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while searching categories for medicines.",
      error: error.message,
    });
  }
};

exports.searchByStock = async (req, res) => {
  console.log("The search body is: ", req.body);
  const { inStockFilter: stock } = req.body;
  try {
    let query;
    if (stock) {
      query = Medicine.find().where("stock").lte(0);
      const results = await query.exec();
      res.json(results);
    } else {
      query = Medicine.find().where("stock").gte(0);
      const results = await query.exec();
      res.json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while searching for medicines.",
      error: error.message,
    });
  }
};
