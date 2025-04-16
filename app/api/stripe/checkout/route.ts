import { NextRequest, NextResponse } from "next/server";
import stripe from '@/app/lib/stripe';

export async function POST(req: NextRequest) {
    const { testId, userEmail } = await req.json();

    const price = process.env.STRIPE_PRICE_ID;

    if (!price) {
        return NextResponse.json(
            { error: "Price ID is not set in environment variables" },
            { status: 500 }
        );
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/cancel`,
            customer_email: userEmail,
            metadata: {
                testId: testId,
                userEmail: userEmail,
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