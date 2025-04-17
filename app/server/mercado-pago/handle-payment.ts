import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
    // Handle the payment data as needed
    console.log('Payment data:', paymentData);
    // You can save this data to your database or perform other actions
}