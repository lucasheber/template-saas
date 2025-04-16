import { NextRequest, NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";
import { auth } from "@/app/lib/auth";
import { getOrCreateCustomerId } from "@/app/server/stripe/get-customer-id";

export async function POST(req: NextRequest) {
    const { testId } = await req.json();
    const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

    if (!price) {
        return NextResponse.json({ error: "Price ID is not set in environment variables" }, { status: 500 });
    }
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId || !userEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = await getOrCreateCustomerId(userId);

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            payment_method_types: ["card"],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/cancel`,
            customer: customerId,
            metadata: {
                testId: testId,
                userEmail: userEmail,
                userId: userId,
            },
        });
        return NextResponse.json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        return NextResponse.json(
            { error: "Failed to create Stripe Checkout session" },
            { status: 500 }
        );
    }
}
