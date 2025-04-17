import { db } from '@/app/lib/firebase';
import 'server-only';
import Stripe from "stripe";

export async function handleSessionCompleted(event: Stripe.Event) {
    console.log("Session completed", event);

    // check if the price is a onetime payment or a subscription
    const metadata = event.data.object.metadata as Stripe.Metadata;
    if (metadata.price_id === process.env.STRIPE_PRODUCT_ID) {
        console.log("One-time payment");
    } else if (metadata.price_id === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
        console.log("Subscription");
    }

    const customerId = event.data.object.customer as string;

    // Update users subscription status in your database
    const userRef = await db.collection("users")
        .where("stripeCustomerId", "==", customerId)
        .limit(1)
        .get();

    if (userRef.empty) {
        console.log("User not found");
        return;
    }
    const userDoc = userRef.docs[0];
    const userId = userDoc.id;

    await db.collection("users").doc(userId).update({
        subscriptionStatus: "active",
        subscriptionId: event.data.object.subscription,
    });
    console.log("User subscription status updated");
    // Send a welcome email to the user
}