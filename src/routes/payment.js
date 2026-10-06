const express = require("express");
const userAuth = require("../middlewares/adminauth");
const razorpayInstance = require("../utils/razorpay");
const plans = require("../utils/const");
const Payment = require("../model/Payment");

const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { planType } = req.body;
    const plan = plans[planType];
    

    if (!plan) {
      return res.status(400).json({ error: "Invalid plan type" });
    }

    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { firstName, lastName, emailId, planType },
    });

    const paymentInstance = new Payment({
      UserId: req.user._id, // must match the schema field name
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      planType,
      status: order.status, // "created"
      notes: { firstName, lastName, emailId },
    });

    const savedPayment = await paymentInstance.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env. YOUR_KEY_ID});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});



paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const signature = req.get("X-Razorpay-Signature");
    if (!signature) {
       return res.status(400).json({ msg: "Missing signature" });
    }if (!signature) {
  return res.status(400).json({ msg: "Missing signature" });
}


    const isValid = validateWebhookSignature(
      JSON.stringify(req.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    // only a captured payment makes the user premium
    if (req.body.event !== "payment.captured") {
      return res.status(200).json({ msg: "event ignored" });
    }

    const details = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: details.order_id });
    if (!payment) {
      return res.status(200).json({ msg: "order not found" });
    }
    if (payment.status === "captured") {
      return res.status(200).json({ msg: "already processed" });
    }

    payment.status = details.status;
    payment.paymentId = details.id;
    await payment.save();

    await User.findByIdAndUpdate(payment.userId, {
      isPremium: true,
      membershipType: payment.notes?.membershipType,
    });

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
   e
    const user = await User.findById(req.user._id).select("isPremium membershipType");
    res.json({
      isPremium: !!user?.isPremium,
      membershipType: user?.membershipType || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = paymentRouter;