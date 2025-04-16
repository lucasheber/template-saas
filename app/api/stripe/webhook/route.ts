import stripe from "@/app/lib/stripe";
import { handleSessionCompleted } from "@/app/server/stripe/handle-session-completed";
import { handleSubscriptionCanceled } from "@/app/server/stripe/handle-subscription-canceled";

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") || "";

    if (!body || !signature) {
        return new Response("Invalid request", { status: 400 });
    }
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
        case "checkout.session.completed": await handleSessionCompleted(event); break; // payment succeeded
        case "checkout.session.expired": break; // payment failed
        case "checkout.session.async_payment_succeeded": break; // boleto payment succeeded
        case "checkout.session.async_payment_failed": break; // boleto payment failed
        case "customer.subscription.created": break; // subscription created
        case "customer.subscription.updated": break; // subscription updated
        case "customer.subscription.deleted": await handleSubscriptionCanceled(event); break; // subscription deleted
        default: {
            console.log(`Unhandled event type ${event.type}`);
            return new Response(`Unhandled event type ${event.type}`, { status: 400 }); 
        }
    }

    return new Response("Webhook received", { status: 200 });
}
