import 'server-only';

import { db } from '@/app/lib/firebase';
import stripe from '@/app/lib/stripe';

export async function getOrCreateCustomerId(userId: string) {
    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error("User not found");
        }

        const userData = userDoc.data();
        const stripeCustomerId = userData?.stripeCustomerId;

        if (stripeCustomerId) {
            return stripeCustomerId;
        }

        // Create a new Stripe customer
        const customer = await stripe.customers.create({
            email: userData?.email,
            name: userData?.name,
            metadata: {
                firebaseUID: userId,
            },
        });

        // Save the Stripe customer ID to Firestore
        await userRef.update({
            stripeCustomerId: customer.id,
        });

        return customer.id;

    } catch (error) {
        console.error("Error getting or creating Stripe customer ID:", error);
        throw new Error("Failed to get or create Stripe customer ID");
    }
}
// This function is used to get or create a Stripe customer ID for a user.
// It first checks if the user already has a Stripe customer ID stored in Firestore.
// If the user does not have a Stripe customer ID, it creates a new Stripe customer
// and saves the Stripe customer ID to Firestore.