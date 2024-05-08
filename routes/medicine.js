const express = require("express");
const medicineController = require("../controller/medicine");
const commentController = require("../controller/comment");
const medicineRouter = express.Router();
const multer = require("multer");
const path = require("path");

//This line is for getting the directore of the "__filename". Here the file name is "backend"
const scriptDir = path.dirname(__filename);
//This line construct the path with the "Images" folder
const imagesFolderPath = path.join(scriptDir, "..", "Images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "../Images");
    cb(
      null,
      //Here we used the constructed path
      imagesFolderPath
      // "C:/Users/USER/Desktop/Pharmacy/Backend/Images"
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    const fileName = Date.now() + path.extname(file.originalname);
  },
});

const upload = multer({ storage: storage });

const multerErrorHandler = (err, req, res, next) => {
  console.log("Req Body is: ", req.body, "Req File is", req.file);
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    console.error(err);
    res.status(500).send(err);
  } else if (err) {
    // An unknown error occurred when uploading.
    console.error(err);
    res.status(500).send(err);
  }
  // Everything went fine.
  next();
};

exports.upload = upload;

medicineRouter
  .post(
    "/",
    upload.single("image"),
    multerErrorHandler,
    medicineController.createMedicine
  )
  .get("/", medicineController.getAllMedicine)
  .get("/getOrder/date", medicineController.getMedicineByDate)
  .get("/getOrder/withoudate", medicineController.getMedicineWithoutDate)
  .get("/:id", medicineController.GetOneMedicine)

  .put(
    "/:id",
    upload.single("image"),
    multerErrorHandler,
    medicineController.replaceMedicine
  )
  .patch(
    "/:id",
    upload.single("image"),
    multerErrorHandler,
    medicineController.updateMedicine
  )
  .patch("/star/:id", medicineController.updateStar)
  .delete("/:id", medicineController.deleteMedicine)
  .post("/:id/comments", commentController.addComment)
  .get(
    "/:id/comments/:commentId",
    commentController.getOneCommentForOneMedicine
  )
  .get("/:id/comments", commentController.getAllCommentForOneMedicine)
  .put("/:id/comments/:commentId", commentController.putComment)
  .patch("/:id/comments/:commentId", commentController.updateComment)
  .delete("/:id/comments/:commentId", commentController.deleteComment);

exports.medicineRouter = medicineRouter;
