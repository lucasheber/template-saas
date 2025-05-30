import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
  maxNetworkRetries: 3,
  telemetry: false,
});

export default stripe;
