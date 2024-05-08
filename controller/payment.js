const mongoose = require("mongoose");
const model = require("../model/medicine");
const model2 = require("../model/user");
const Medicine = model.Medicine;
const User = model2.User;
const stripe = require("stripe")(
  "sk_test_51OpvC0A1UboyhyVAiOzJKaf270wU4BZ4yqPIGeMw1h6oj62RgsZlKR6VGt7VAUagtuKznWLxRRcqlWxtGSiB9yYo00RZokXx7l"
);

exports.payment = async (req, res) => {
  const token = req.body.userToken;
  const user = await User.findOne({ token: token });
  const productid = req.body.items.map((el) => el._id);
  const idArray = productid.map(
    (id) => new mongoose.Types.ObjectId(String(id))
  );
  const products = await Medicine.find({ _id: { $in: idArray } });

  function findMatchingProduct(products, item) {
    const matchingProduct = products.find(
      (product) => product._id.toString() === item._id
    );
    if (matchingProduct) {
      return matchingProduct;
      // Perform any operations with matchingProduct here
    } else {
      return "cannot find";
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const product = findMatchingProduct(products, item);
        const amount =
          product.discountPercentage > 0
            ? (
                product.price -
                (product.price * product.discountPercentage) / 100
              ).toFixed(2)
            : product.price.toFixed(2);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: amount * 100,
          },
          quantity: item.inTotal,
        };
      }),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ url: session.url, message: "ok" });
    console.log("Successfull");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Un - Successfull");
  }
};

exports.updateUser = async (req, res) => {
  //console.log(req.body);
  try {
    const { medicineId, userToken } = req.body;

    // Find the user by token
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch medicine details for each medicineId
    const medicineDetails = await Medicine.find({
      _id: { $in: medicineId.map((med) => med.id) },
    });

    // Prepare the buy history updates
    const buyHistoryUpdates = medicineDetails.map((med) => {
      // Find the corresponding medicineId object from the request
      const medRequest = medicineId.find(
        (m) => m.id.toString() === med._id.toString()
      );
      return {
        medId: med._id.toString(),
        name: med.name, // Assuming the medicine model has a 'name' field
        isRated: false,
        rating: null,
        commentId: [],
        date: new Date(),
        total: medRequest.total, // Include the total from the request
      };
    });

    // Update the user's buy history
    user.buyHistory = [...user.buyHistory, ...buyHistoryUpdates];

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMedicine = async (req, res) => {
  const medicine = req.body.medicine;

  try {
    // Process each medicine item
    for (const med of medicine) {
      const { id, total } = med;

      // Find the medicine by ID
      const medicineItem = await Medicine.findById(id);

      // Check if the medicine exists and if the total is valid
      if (!medicineItem || total <= 0) {
        return res
          .status(400)
          .send({ message: "Invalid medicine ID or total" });
      }

      // Calculate the new stock and totalSellMoney
      const newStock = medicineItem.stock - total;
      const newTotalSellMoney =
        medicineItem.totalSellMoney +
        (medicineItem.discountPercentage > 0
          ? (medicineItem.price -
              (medicineItem.price * medicineItem.discountPercentage) / 100) *
            total
          : medicineItem.price * total);

      // Check if the new stock is negative
      if (newStock < 0) {
        return res.status(400).send({ message: "Insufficient stock" });
      }

      // Update the medicine item
      const updatedMedicine = await Medicine.findByIdAndUpdate(
        id,
        {
          $inc: {
            totalItemSold: total,
            stock: -total, // Subtract the total from the stock
            totalSellMoney: newTotalSellMoney - medicineItem.totalSellMoney, // Calculate the difference
          },
        },
        { new: true } // Return the updated document
      );

      // Log the updated medicine item
      //console.log(updatedMedicine);
    }

    // Send a success response
    res.status(200).send({ message: "Medicine updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

exports.fetchProducts = async (req, res) => {
  try {
    const productIds = req.body.productIds;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing productIds" });
    }
    const idArray = productIds.map(
      (id) => new mongoose.Types.ObjectId(String(id))
    );
    console.log(idArray);
    const products = await Medicine.find({ _id: { $in: idArray } });
    console.log(products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};
