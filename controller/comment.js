const mongoose = require("mongoose");
const model = require("../model/medicine");

const Medicine = model.Medicine;
//Adding Comment
exports.addComment = async (req, res) => {
  const medicineId = req.params.id;
  const newComment = {
    text: req.body.text, // Assuming 'text' is the property you want to save in the comment
    author: req.body.author, // Assuming 'author' is another property you want to save
    // date: new Date(), // Uncomment this line if you want to include a timestamp
  };

  try {
    // Find the medicine by ID
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }

    // Add the new comment to the medicine's comments array
    medicine.comments.push(newComment);

    // Save the updated medicine document
    const updatedMedicine = await medicine.save();

    // Respond with the updated medicine document
    res.status(201).json(updatedMedicine);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting all Sub-document of a document
exports.getAllCommentForOneMedicine = async (req, res) => {
  const id = req.params.id;
  try {
    const medicine = await Medicine.findById(id).select("comments");
    res.json(medicine);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting 1 sub-document of a document
exports.getOneCommentForOneMedicine = async (req, res) => {
  console.log("Getting comments");
  try {
    const medicineId = req.params.id;
    const commentId = req.params.commentId;

    // Find the medicine by ID
    const medicine = await Medicine.findById(medicineId);
    console.log("Medicines are:", medicine);

    // If medicine is not found, send a  404 response
    if (!medicine) {
      console.log("Medicine cannot be fond");
      res.status(404).json({ message: "Medicine not found" });
      return;
    }

    // Find the comment by ID within the medicine's comments array
    const comment = medicine.comments.id(commentId);
    console.log(comment);

    // If comment is not found, send a  404 response
    if (!comment) {
      console.log("Comment cannot be found");
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Send the comment as a JSON response
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

//PUT operation on Sub-document
exports.putComment = async (req, res) => {
  const medicineId = req.params.id;
  const commentId = req.params.commentId;
  const updateData = { ...req.body, _id: commentId };

  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId, "comments._id": commentId }, // Find the medicine and the specific comment
      { $set: { "comments.$": updateData } }, // Update the matched comment
      { new: true } // Return the updated document
    );

    if (!medicine) {
      return res
        .status(404)
        .send({ message: "Medicine or Comment not found." });
    }

    res.send(medicine);
  } catch (error) {
    console.log("An erorr occured");
    res
      .status(500)
      .send({ message: error.message || "Error updating comment." });
  }
};

//Update Operation on sub-document
exports.updateComment = async (req, res) => {
  const medicineId = req.params.id;
  const commentId = req.params.commentId;
  const update = req.body;

  try {
    // Find the medicine by ID
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).send({ message: "Medicine not found" });
    }

    // Find the comment to update
    const comment = medicine.comments.id(commentId);
    console.log("The comment is:", comment);
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    // Apply the updates to the comment
    Object.assign(comment, update);

    // Save the medicine with the updated comment
    await medicine.save();

    res.json(medicine);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Deleting Sub document
exports.deleteComment = async (req, res) => {
  const medicineId = req.params.id;
  const commentId = req.params.commentId;

  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: medicineId }, // Find the medicine by its ID
      { $pull: { comments: { _id: commentId } } }, // Remove the comment with the given ID
      { new: true } // Option to return the updated document
    );

    if (!medicine) {
      return res.status(404).send({ message: "Medicne not found." });
    }

    res.send(medicine);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error deleting comment." });
  }
};
