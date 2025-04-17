import { mercadoPagoConfig } from "@/app/lib/mercadopago";
import { Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { testId, userEmail } = await req.json();

    try {
        const preference = new Preference(mercadoPagoConfig);
        const createPreference = await preference.create({
            body: {
                external_reference: testId,
                metadata: {
                    userEmail: userEmail,
                },
                items: [
                    {
                        id: testId,
                        title: "Test Item",
                        description: "Test Item Description",
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: 1,
                        category_id: "services",
                    },
                ],
                payment_methods: {
                    excluded_payment_types: [
                        { id: "debit_card", },
                        { id: "atm", },
                    ],
                    installments: 5,
                },
                auto_return: "approved",
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_URL}/success`,
                    failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
                    pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
                },
            }
        });

        if (!createPreference) {
            return NextResponse.json({
                error: "Failed to create Mercado Pago Checkout"
            }, { status: 500 });
        }

        console.log("Preference created:", createPreference);
        return NextResponse.json({
            id: createPreference.id,
            init_point: createPreference.init_point,
        }, { status: 200 });
    } catch (error) {
        console.error("Error creating Mercado Pago Checkout:", error);
        return NextResponse.json({
            error: "Failed to create Mercado Pago Checkout"
        }, { status: 500 });
    }
}