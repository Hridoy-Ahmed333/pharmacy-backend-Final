const express = require("express");
const supplyController = require("../controller/supply");
const supplyRouter = express.Router();
supplyRouter
  .post("/", supplyController.createSupply)
  .get("/", supplyController.getSuppply)
  .post("/update", supplyController.updateSupply);
//   .get("/:id", supplyController.getOneSupply)
//   .patch("/:id", supplyController.updateSupply)
//   .delete("/:id", supplyController.deleteSupply);

exports.supplyRouter = supplyRouter;
