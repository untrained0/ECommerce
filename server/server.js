const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const router = express.Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const shortid = require("shortid");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post("/cart", async (req, res) => {
  const razorpay = new Razorpay({
    key_id: "rzp_test_1dRKNhvcJnqWY7",
    key_secret: "ThECYGiRbte1rv0ZlbQuKGUA",
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);

    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Internal Server Error!");
  }
});

app.get("/payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  const razorpay = new Razorpay({
    key_id: "rzp_test_1dRKNhvcJnqWY7",
    key_secret: "ThECYGiRbte1rv0ZlbQuKGUA",
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      return res.status(500).json("Error at Razorpay loading");
    }

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).send("Failed to Fetch");
  }
});

app.post("/verification", (req, res) => {
  const secret = "GX6QaXTYlfCtCmFkXLVlJauA";

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    require("fs").writeFileSync("payment1.json", JSON.stringify(req.body, null, 4));
  } else {
    console.log("Invalid signature");
  }
  res.json({ status: "ok" });
});

const usersRoute = require("./routes/userRoute");
const productsRoute = require("./routes/productsRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationsRoute = require("./routes/notificationsRoute");

app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/razorpay", router);

app.listen(port, () => console.log(`Node/Express Server is started on port ${port}`));
