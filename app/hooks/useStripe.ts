import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export function useStripe() {
    const [stripe, setStripe] = useState<Stripe | null>(null);

    useEffect(() => {
        async function loadStripeAsync() {
            const stripe = await loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
            );
            setStripe(stripe);
        }

        loadStripeAsync();
    }, []);

    async function createPaymentStripeCheckout(checkoutData: {testId: string, userEmail: string}) {
        if (!stripe) {
            throw new Error("Stripe not loaded");
        }

        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });
            if (!response.ok) {
                throw new Error("Failed to create Stripe Checkout session");
            }

            const data = await response.json();
            await stripe.redirectToCheckout({ sessionId: data.id });

        }
        catch (error) {
            console.error("Error creating Stripe Checkout:", error);
        }
    }

    async function createSubscriptionStripeCheckout(checkoutData: {testId: string, userEmail: string}) {
        if (!stripe) {
            throw new Error("Stripe not loaded");
        }
        try {
            const response = await fetch("/api/stripe/checkout-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });
            if (!response.ok) {
                throw new Error("Failed to create Stripe Checkout session");
            }
            const data = await response.json();
            await stripe.redirectToCheckout({ sessionId: data.id });
        }
        catch (error) {
            console.error("Error creating Stripe Checkout:", error);
        }
    }

    async function handleCreateStripePortal() {
        if (!stripe) {
            throw new Error("Stripe not loaded");
        }
        try {
            const response = await fetch("/api/stripe/portal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to create Stripe Portal session");
            }
            const data = await response.json();
            window.location.href = data.url;
        }
        catch (error) {
            console.error("Error creating Stripe Portal:", error);
        }
    }

    return { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal, };
}