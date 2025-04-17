import 'server-only';

import { db } from '@/app/lib/firebase';
import stripe from '@/app/lib/stripe';

/**
 * This function retrieves or creates a Stripe customer ID for a given user.
 * 
 * @param userId - The ID of the user for whom to get or create a Stripe customer ID.
 * @returns The Stripe customer ID.
 * @throws Error - If the user is not found or if there is an error creating the Stripe customer.
 */
export async function getOrCreateCustomerId(userId: string): Promise<string> {
    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error("User not found");
        }

        const userData = userDoc.data();
        const stripeCustomerId: string = userData?.stripeCustomerId;

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
