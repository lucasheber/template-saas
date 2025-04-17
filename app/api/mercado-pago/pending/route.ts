import { mercadoPagoConfig } from "@/app/lib/mercadopago";
import { Payment } from "mercadopago";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const external_reference = searchParams.get("external_reference");
    const payment_id = searchParams.get("payment_id");

    console.log("Pending payment", { status, external_reference, payment_id });
    if (!status || !external_reference || !payment_id) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
            status: 400,
        });
    }

    const payment = new Payment(mercadoPagoConfig);
    const paymentDetails = await payment.get({id: payment_id});

    if (paymentDetails.status !== "approved" || paymentDetails.date_approved === null) {
        return new Response(JSON.stringify({ error: "Payment not approved" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return new Response(JSON.stringify({ status, external_reference, payment_id }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}