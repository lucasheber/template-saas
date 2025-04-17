import { mercadoPagoConfig, validateWebhookRequest } from "@/app/lib/mercadopago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";
import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        validateWebhookRequest(req);

        const body = await req.json();
        const { type, data } = body;

        // Handle different webhook events
        switch (type) {
            case 'payment': // Handle payment created event
                console.log('Payment created:', data);
                const payment = new Payment(mercadoPagoConfig);
                const paymentData = await payment.get(data.id);
                if (paymentData.status === 'approved' || paymentData.date_approved !== null) {
                    handleMercadoPagoPayment(paymentData);
                }
                break;
            case 'subscription_preapproval': // Handle subscription preapproval event
                console.log('Subscription preapproval:', data);
                break;
            default:
                console.log('Unhandled event type:', type);
                break;
        }

        return new NextResponse('Webhook received', { status: 200 });
    } catch (error) {
        console.error('Error handling Mercado Pago webhook:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}