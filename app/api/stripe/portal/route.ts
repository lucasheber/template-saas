import { NextRequest, NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase";

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userDoc.data();
        const stripeCustomerId = userData?.stripeCustomerId;

        if (!stripeCustomerId) {
            return NextResponse.json({ error: "Stripe customer ID not found" }, { status: 404 });
        }

        const customerPortalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${req.headers.get("origin")}/dashboard`,
        });

        return NextResponse.json({ url: customerPortalSession.url });

    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        return NextResponse.json({ error: "Failed to create Stripe Checkout session" }, { status: 500 });
    }


}