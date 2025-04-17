"use client";

import useMercadoPago from "@/app/hooks/userMercadoPago";
import { useStripe } from "@/app/hooks/useStripe";

export default function Payments() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();

  const { createMercadoPagoCheckout } = useMercadoPago();

  const params = {
    testId: "testId",
    userEmail: "lucas.heber07@gmail.com",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1>Payments</h1>
      <p className="mb-5">Payments page content goes here.</p>

      <button
        className="btn btn-primary border p-2 mb-2 w-100"
        onClick={() => createPaymentStripeCheckout(params)}
      >
        {" "}
        Create Payment{" "}
      </button>
      <button
        className="btn btn-primary border p-2 mb-2 w-100"
        onClick={() => createSubscriptionStripeCheckout(params)}
      >
        {" "}
        Create Subscription{" "}
      </button>
      <button
        className="btn btn-primary border p-2 mb-2 w-100"
        onClick={() => handleCreateStripePortal()}
      >
        {" "}
        Create Portal{" "}
      </button>

      <hr />
      <button
        className="btn btn-primary border p-2 mb-2 w-100"
        onClick={() => createMercadoPagoCheckout(params)}
      >
        {" "}
        Create Mercado Pago Checkout{" "}
      </button>
    </div>
  );
}
