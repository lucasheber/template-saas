import 'server-only';
import Stripe from "stripe";

export async function handleSubscriptionCanceled(event: Stripe.CustomerSubscriptionDeletedEvent) {
    console.log("Subscription canceled", event);
    // check if the price is a onetime payment or a subscription
    const metadata = event.data.object.metadata as Stripe.Metadata;
    if (metadata.price_id === process.env.STRIPE_PRODUCT_ID) {
        console.log("One-time payment");
    } else if (metadata.price_id === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
        console.log("Subscription");
    }
}