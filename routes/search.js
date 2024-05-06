const express = require("express");
const medicineController = require("../controller/medicine");
const searchRouter = express.Router();

searchRouter
  .post("/", medicineController.searchMedicine)
  .post("/cat", medicineController.searchByCategoryMedicine)
  .post("/sto", medicineController.searchByStock);
exports.searchRouter = searchRouter;
